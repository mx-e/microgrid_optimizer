module MicrogridUtils

export adjust_capex, map


#IN: full capex in €, full_lieftime in years, actual_time in hours
#OUT: adjusted capex
adjust_capex(full_capex, full_lifetime, actual_time) = full_capex / (full_lifetime*8766/actual_time)

function map(func, list)
    retval = []
    for i in list
        push!(retval, func(i))
    end
    return retval
end

end 

