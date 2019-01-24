module MicrogridUtils

export adjust_capex, map, compute_hourly_discount, array_of_arrays_to_matrix, Device, GenerationDevice, StorageDevice, LinearGenerationDevice, DiscreteGenerationDevice, LinearStorageDevice, DiscreteStorageDevice, constructLinearGenerationDevice, constructDiscreteGenerationDevice, constructLinearStorageDevice, constructDiscreteStorageDevice, Grid, constructGrid, Household, constructHousehold

#IN: full capex in €, full_lieftime in years, actual_time in hours
#OUT: adjusted capex
adjust_capex(full_capex, full_lifetime, actual_time) = full_capex / (full_lifetime*8760/actual_time)

function map(func, list)
    retval = []
    for i in list
        push!(retval, func(i))
    end
    return retval
end

#IN: yearly disoiunt rate
#OUT: hourly discount rate
compute_hourly_discount(yearly_discount_rate) = ((1+yearly_discount_rate) ^ (1/8760)) - 1

function array_of_arrays_to_matrix(arr, X, Y)
    retval = []
    for i in arr
        push!(retval, i...)
    end
    return reshape(retval, X, Y)
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

function constructLinearGenerationDevice(device::Dict{Any,Any}, S::Int32, T::Int32)
    opts = device["opts"]
    if opts["isMaxFlConstant"] == false
        maxFl = array_of_arrays_to_matrix(device["maxFl"], S, T)
    else
        maxFL = fill(device["maxFl"], S, T)
    end
    cCap = device["cCap"]
    cOpFix = device["cOpFix"]
    cOpVar = device["cOpVar"]
    tLife = device["tLife"]
    EFFel = device["EFFel"]
    PR = device["PR"]

    return LinearGenerationDevice(cCap, cOpFix, cOpVar, tLife, EFFel, PR, maxFL)
end

function constructDiscreteGenerationDevice(device::Dict{Any,Any}, S::Int32, T::Int32)
    opts = device["opts"]
    if opts["isMaxFlConstant"] == false
        maxFl = array_of_arrays_to_matrix(device["maxFl"], S, T)
    else
        maxFL = fill(device["maxFl"], S::int32, T::int32)
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

function constructLinearStorageDevice(device::Dict{Any,Any})
    cCap = device["cCap"]
    tLife = device["tLife"]
    EFFplusminus = device["EFFplusminus"]
    EFFplus = sqrt(EFFplusminus)
    EFFminus = 1.0/EFFplus
    maxPplus = device["maxPplus"]
    maxPminus = device["maxPminus"]
    return LinearStorageDevice(cCap, tLife, EFFplusminus, EFFplus, EFFminus maxPplus, maxPminus)
end

function constructDiscreteStorageDevice(device::Dict{Any,Any})
    CAP = device["CAP"]
    cCap = device["cCap"]
    tLife = device["tLife"]
    EFFplusminus = device["EFFplusminus"]
    EFFplus = sqrt(EFFplusminus)
    EFFminus = 1.0/EFFplus
    maxPplus = device["maxPplus"]
    maxPminus = device["maxPminus"]
    return LinearStorageDevice(CAP, cCap, tLife, EFFplusminus, EFFplus, EFFminus, maxPplus, maxPminus)
end

function constructGrid(grid::Dict{Any,Any}, S::int32, T::int32)
    opts = grid["opts"]
    if opts["isCostConstant"] == true
        gridC = fill(grid["gridC"], S, T)
        feedC = fill(grid["feedC"], S, T)
    else
        gridC = array_of_arrays_to_matrix(grid["gridC"], S, T)
        feedC = array_of_arrays_to_matrix(grid["feedC"], S, T)
    end
    if opts["isSupplyConstant"] == true
        maxS = fill(grid["maxS"], S, T)
    else
        maxS = array_of_arrays_to_matrix(grid["maxS"], S, T)
    end
    if opts["isDemandConstant"] == true
        maxD = fill(grid["maxD"], S, T)
    else
        maxD = array_of_arrays_to_matrix(grid["maxD"], S, T)
    end
    return Grid(maxS, maxD, gridC, feedC)
end

function constructHousehold(household::Dict{Any,Any}, S::int32, T::int32)
    opts = household["opts"]
    DEM = []
    if opts["areDemandSharesFixeed"] == true
        curtailableShare = opts["curtailableShare"]
        shiftableShare = opts["shiftableShare"]
        for i in household["DEM"]
            for y in i
                push!(DEM, y * (1.0-curtailableShare-shiftableShare))
                push!(DEM, y * shiftableShare)
                push!(DEM, y * curtailableShare)
        end
    else
        for i in household["DEM"]
            for y in i
                push!(DEM, y...)
        end
    end
    reshape(DEM, S, T, 3)
    shiftP = household["shiftP"]
    curtP = household["curtP"]
    return Household(shiftP, curtP, DEM)
end





