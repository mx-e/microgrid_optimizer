
#IN: full capex in €, full_lieftime in years, actual_time in hours
#OUT: adjusted capex
adjust_capex(full_capex, full_lifetime, actual_time) = full_capex / (full_lifetime*8760/actual_time)
adjust_opex(full_opex, actual_time) = full_opex / (8760/actual_time)

function map(func, list)
    retval = []
    for i in list
        push!(retval, func(i))
    end
    return retval
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
    maxFl = []
    if opts["isMaxFlConstant"] == false
        maxFl = array_of_arrays_to_matrix(device["maxFl"], S, T)
    else
        maxFl = fill(device["maxFl"],(S, T))
    end
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
    if opts["isMaxFlConstant"] == false
        maxFl = array_of_arrays_to_matrix(device["maxFl"], S, T)
    else
        maxFL = fill(device["maxFl"],(S, T))
    end

    if opts["extendTimelines"] == true
        maxFl = createExtendedTimeline(maxFl,S,T)
    end

    if opts["applyNoise"] == true
        variance = opts["variance"]
        maxFl = applyNoise(maxFL,variance)
    end

    CAP = device["CAP"]
    cCap = device["cCap"]
    cOpFix = device["cOpFix"]
    cOpVar = device["cOpVar"]
    tLife = device["tLife"]
    EFFel = device["EFFel"]
    PR = device["PR"]

    return DiscreteGenerationDevice(CAP, cCap, cOpFix, cOpVar, tLife, EFFel, PR, maxFL)
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

    if opts["extendTimelines"] == true
        DEM = createExtendedTimeline(household["DEM"],S,T)
    else
        DEM = household["DEM"]
    end

    if opts["applyNoise"] == true
        variance = opts["variance"]
        DEM = applyNoise(DEM, variance)
    end

    if opts["areDemandSharesFixed"] == true
        curtailableShare = opts["curtailableShare"]
        shiftableShare = opts["shiftableShare"]
        for i in household["DEM"]
            for y in i
                push!(DEM, y * (1.0-curtailableShare-shiftableShare))
                push!(DEM, y * shiftableShare)
                push!(DEM, y * curtailableShare)
            end
        end
    else
        for i in household["DEM"]
            for y in i
                push!(DEM, y...)
            end
        end
    end
    DEM = reshape(DEM, (S, T, 3))
    shiftP = household["shiftP"]
    curtP = household["curtP"]
    return Household(shiftP, curtP, DEM)
end

function createExtendedTimeline(demand::Array, S::Int64, T::Int64)
    for s in demand
        current_length = length(s)
        difference = T-current_length
        if difference > 0
            for i = (current_length+1):T
                push!(s,s[(convert(Int64,i) % current_length) + 1])
            end
        end
    end
    return demand
end

function applyNoise(demand::Array{Any,1}, variance::Float64)
    distribution = Normal(1,variance)
    for s in demand
        for t in s
            t = t * rand(distribution)
        end
    end
    return demand
end
