module MicrogridUtils

export adjust_capex, map, compute_hourly_discount, array_of_arrays_to_matrix


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

function array_of_arrays_to_matrix(arr, T, N)
    retval = []
    for i in arr
        push!(retval, i...)
    end
    return reshape(retval, T, N)
end 
end 



