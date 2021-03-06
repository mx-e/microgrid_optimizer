
#IN: full capex in €, full_lieftime in years, actual_time in hours
#OUT: adjusted capex
function adjust_capex(full_capex, full_lifetime, actual_time)
    return full_capex * actual_time / (full_lifetime * 8760.)
end

function adjust_opex(full_opex, actual_time)
    return full_opex * (actual_time / 8760)
end

function map(func, list)
    retval = []
    for i in list
        push!(retval, func(i))
    end
    return retval
end

function array_of_arrays_to_matrix(arr, T, N)
    retval = []
    for i in arr
        push!(retval, i...)
    end
    return reshape(retval, T, N)
end

abstract type Device end
abstract type GenerationDevice <: Device end
abstract type StorageDevice <: Device end

struct LinearGenerationDevice <: GenerationDevice
    cCap::Float64
    cOpFix::Float64
    cOpVar::Float64
    tLife::Float64
    EFFel::Float64
    PR::Float64
    maxFl::Array{Float64,2}
end

struct DiscreteGenerationDevice <: GenerationDevice
    CAP::Float64
    cCap::Float64
    cOpFix::Float64
    cOpVar::Float64
    tLife::Float64
    EFFel::Float64
    PR::Float64
    maxFl::Array{Float64,2}
end

struct LinearStorageDevice <: StorageDevice
    cCap::Float64
    tLife::Float64
    EFFplusminus::Float64
    EFFplus::Float64
    EFFminus::Float64
    maxPplus::Float64
    maxPminus::Float64
end

struct DiscreteStorageDevice <: StorageDevice
    CAP::Float64
    cCap::Float64
    tLife::Float64
    EFFplusminus::Float64
    EFFplus::Float64
    EFFminus::Float64
    maxPplus::Float64
    maxPminus::Float64
end

struct Grid
    maxS::Array{Float64,2}
    maxD::Array{Float64,2}
    gridC::Array{Float64,2}
    feedC::Array{Float64,2}
end

struct Household
    shiftP::Float64
    curtP::Float64
    DEM::Array{Float64,3}
end

function constructLinearGenerationDevice(device::Dict{String,Any}, S::Int64, T::Int64)
    opts = device["opts"]
    maxFl = device["maxFl"]

    if opts["isMaxFlConstant"] == false
        if opts["adaptTimelines"] == true
            maxFl = createAdaptedTimeline(maxFl,S,T)
        end
    else
        maxFl = fill(maxFl,(S*T))
    end
    if opts["applyNoise"] == true
        variance = opts["variance"]
        maxFl = applyNoise(maxFl,variance)
    end

    newFl = []
    for i in maxFl
        for y in i
            push!(newFl, y...)
        end
    end
    maxFl = reshape(newFl, (T, S))


    cCap = device["cCap"]
    cOpFix = device["cOpFix"]
    cOpVar = device["cOpVar"]
    tLife = device["tLife"]
    EFFel = device["EFFel"]
    PR = device["PR"]

    return LinearGenerationDevice(cCap, cOpFix, cOpVar, tLife, EFFel, PR, maxFl)
end

function constructDiscreteGenerationDevice(device::Dict{String,Any}, S::Int64, T::Int64)
    opts = device["opts"]
    maxFl = device["maxFl"]
    if opts["isMaxFlConstant"] == false
        if opts["adaptTimelines"] == true
            maxFl = createAdaptedTimeline(maxFl,S,T)
        end
    else
        maxFl = fill(maxFl,(S*T))
    end
    if opts["applyNoise"] == true
        variance = opts["variance"]
        maxFl = applyNoise(maxFl,variance)
    end

    newFl = []
    for i in maxFl
        for y in i
            push!(newFl, y...)
        end
    end
    maxFl = reshape(newFl, (T, S))


    CAP = device["CAP"]
    cCap = device["cCap"]
    cOpFix = device["cOpFix"]
    cOpVar = device["cOpVar"]
    tLife = device["tLife"]
    EFFel = device["EFFel"]
    PR = device["PR"]

    return DiscreteGenerationDevice(CAP, cCap, cOpFix, cOpVar, tLife, EFFel, PR, maxFl)
end

function constructLinearStorageDevice(device::Dict{String,Any})
    cCap = device["cCap"]
    tLife = device["tLife"]
    EFFplusminus = device["EFFplusminus"]
    EFFplus = sqrt(EFFplusminus)
    EFFminus = 1.0/EFFplus
    maxPplus = device["maxPplus"]
    maxPminus = device["maxPminus"]
    return LinearStorageDevice(cCap, tLife, EFFplusminus, EFFplus, EFFminus, maxPplus, maxPminus)
end

function constructDiscreteStorageDevice(device::Dict{String,Any})
    CAP = device["CAP"]
    cCap = device["cCap"]
    tLife = device["tLife"]
    EFFplusminus = device["EFF+-"]
    EFFplus = sqrt(EFFplusminus)
    EFFminus = 1.0/EFFplus
    maxPplus = device["maxP+"]
    maxPminus = device["maxP-"]
    return DiscreteStorageDevice(CAP, cCap, tLife, EFFplusminus, EFFplus, EFFminus, maxPplus, maxPminus)
end

function constructGrid(grid::Dict{String,Any}, S::Int64, T::Int64)
    opts = grid["opts"]
    if opts["isCostConstant"] == true
        gridC = fill(grid["gridC"],(S, T))
        feedC = fill(grid["feedC"],(S, T))
    else
        gridC = array_of_arrays_to_matrix(grid["gridC"], S, T)
        feedC = array_of_arrays_to_matrix(grid["feedC"], S, T)
    end
    if opts["isSupplyConstant"] == true
        maxS = fill(grid["maxS"],(S, T))
    else
        maxS = array_of_arrays_to_matrix(grid["maxS"], S, T)
    end
    if opts["isDemandConstant"] == true
        maxD = fill(grid["maxD"],(S, T))
    else
        maxD = array_of_arrays_to_matrix(grid["maxD"], S, T)
    end
    return Grid(maxS, maxD, gridC, feedC)
end

function constructHousehold(household::Dict{String,Any}, S::Int64, T::Int64)
    opts = household["opts"]
    DEM = []

    if opts["adaptTimelines"] == true
        DEM = createAdaptedTimeline(household["DEM"],S,T)
    else
        DEM = household["DEM"]
    end

    if opts["applyNoise"] == true
        variance = opts["variance"]
        DEM = applyNoise(DEM, variance)
    end

    if opts["areDemandSharesFixed"] == true
        newDEM = []
        curtailableShare = opts["curtailableShare"]
        shiftableShare = opts["shiftableShare"]
        for i in DEM
            for y in i
                push!(newDEM, y * (1.0-curtailableShare-shiftableShare))
                push!(newDEM, y * shiftableShare)
                push!(newDEM, y * curtailableShare)
            end
        end
        DEM = newDEM
    else
        newDEM = []
        for i in household["DEM"]
            for y in i
                push!(newDEM, y...)
            end
        end
        DEM = newDEM
    end
    DEM = reshape(DEM, (S, T, 3))
    shiftP = household["shiftP"]
    curtP = household["curtP"]
    return Household(shiftP, curtP, DEM)
end

function createAdaptedTimeline(demand::Array, S::Int64, T::Int64)
    new_demand = []
    for s in demand
        new_s = []
        current_length = length(s)
        for i = 1:T
            push!(new_s,s[(i % current_length) + 1])
        end
        push!(new_demand,new_s)
    end
    return new_demand
end

function applyNoise(arr::Array{Any,1}, variance::Float64)
    distribution = Normal(1,variance)
    new_arr = []
    for s in arr
        new_s = []
        for t in s
            push!(new_s, max(t*rand(distribution), 0.0))
        end
        push!(new_arr,new_s)
    end
    return new_arr
end

function normalize_weights(arr::Array{Any,1})
    total_weight = 0
    len = length(arr)
    for i in arr
        total_weight += i
    end
    new_arr = []
    for i in arr
        push!(new_arr, i/total_weight*len)
    end

    return new_arr
end

function print_results()
    println("")
    println("----------------------")

    println("INVESTMENT:" )
    println("GEN: ")
    println(getvalue(HuGENk))
    println("ST: ")
    println(getvalue(HuDSTn))
    println("----------------------")

    println("Non-Consumption: ")
    println(getvalue(ncS))
    println("----------------------")

    println("GEN: ")
    println(getvalue(genS))
    println("----------------------")
    println("ST: ")
    println(getvalue(fromDST))
    println(getvalue(toDST))
    println("----------------------")

    println("Grid-Supply: ")
    println(getvalue(fromGR))
    println("----------------------")

    println("Grid-Feed-In: ")
    println(getvalue(toGR))
    println("----------------------")

    println("Trade From: ")
    println(getvalue(fromTR))
    println("----------------------")

    println("Trade To: ")
    println(getvalue(toTR))
    println("----------------------")

    println("Shifted Consumption: ")
    println(getvalue(toSC))
    println(getvalue(fromSC))
    println("----------------------")
    println("")

    println("Objective value: ", getobjectivevalue(mod))
end

function export_results(input_data)
    genS_result = []
    dgenS_result = []
    fromST_result = []
    fromDST_result = []
    toST_result = []
    toDST_result = []
    HuDGENm_result = []
    HuDSTn_result = []
    HuGENk_result = []
    HuSTl_result = []

    if K > 0
        genS_result = getvalue(genS)
        HuGENk_result = getvalue(HuGENk)
    end
    if M > 0
        dgenS_result = getvalue(dgenS)
        HuDGENm_result = getvalue(HuDGENm)
    end
    if L > 0
        toST_result = getvalue(toST)
        fromST_result = getvalue(fromST)
        HuSTl_result = getvalue(HuSTl)
    end
    if N > 0
        toDST_result = getvalue(toDST)
        fromDST_result = getvalue(fromDST)
        HuDSTn_result = getvalue(HuDSTn)
    end


    output_data = Dict(
        "objective" => getobjectivevalue(mod),
        "toTR" => getvalue(toTR),
        "fromTR" => getvalue(fromTR),
        "genS" => genS_result,
        "dgenS" => dgenS_result,
        "toST" => toST_result,
        "fromST" => fromST_result,
        "fromDST" => fromDST_result,
        "toDST" => toDST_result,
        "ncS" => getvalue(ncS),
        "toSC" => getvalue(toSC),
        "fromSC" => getvalue(fromSC),
        "toGR" => getvalue(toGR),
        "fromGR" => getvalue(fromGR),
        "HuGENk" => HuGENk_result,
        "HuDGENm" => HuDGENm_result,
        "HuSTl" => HuSTl_result,
        "HuDSTn" => HuDSTn_result,
        "parameters" => input_data,
        "H" => H
    )

    json_string = JSON.json(output_data)

    open("./output.json", "w") do f
        write(f, json_string)
    end

end