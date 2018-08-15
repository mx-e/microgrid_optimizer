using JuMP
using Cbc
using JSON
include("./microgrid_utils.jl")
importall MicrogridUtils

m = Model(solver = CbcSolver())

f = open("./input.json")

input_data = JSON.parse(f)
close(f)
#-------------------------------
#---------SET-PARAMETERS--------
#-------------------------------

#number of households
N = input_data["N"]

#number of timeslices in hours
T = input_data["T"]

#-----BEHAVIOURAL VARIABLES----
#non-consumption price for households
ncc = [0.8, 1.2]

#shifted consumption prices for households
scc = [0.3, 0.5]

#household demand 
demand = array_of_arrays_to_matrix(input_data["demand"], N, T)

#-----ENVIRONMENTAL FACTORS-----
#capacity factor of solar pv
cap_fr = [0,0,0.1,0.2,0.3,0.4,0.4,0.4,0.4,0.3,0.2,0.1]

#------INVESTMENT-OPTIONS------
#- - - - - - PV - - - - - - - -
#capex of solar pv  in € / KW
capex_pv = adjust_capex(1169., 20, T)

#opex fix in € / KW * day
opex_fix_pv = 17.6 / 365

#- - - - Li-Ion-Battery - - - -
#capex of battery storage € / KWh
capex_li_ion = adjust_capex(300., 15, T)

#opex fix in € / KWh * day 
opex_fix_li_ion = 9. / 365

#opex variable in € / KWh 
opex_var_li_ion = 0.0002

#efficiency of battery
efficiency_li_ion = 0.9

#- - - - - Biogas CHP - - - - -
#capex of biogas CHP in € / KW
capex_chp = adjust_capex(429., 20, T)

#opex fix CHP in € / KW * day
opex_fix_chp = 17.2 / 365

#opex variable in € / KWh
opex_var_chp = 0.001

#efficiency of biogas CHP
efficiency_chp = 0.344

#- - - - Biogas Digester - - - -
#capex of biogas digester in € / KW
capex_digester = adjust_capex(731.0, 20, T)

#opex fix of biogas digester in € / KW * day
opex_fix_digester = 29.2 / 365

#- - - - - Gas Storage - - - - -
#capex of gas storage in € / KWh 
capex_gas_st = adjust_capex(0.05, 20, T)

#opex fix of gas storage in € / KWh * day
opex_fix_gas_st = 0.001

#-----OTHER ECONOMIC FACTORS-----
#feed in tariff for main grid for each timestep t 
fit = [0.02,0.02,0.02,0.02,0.02,0.02,0.02,0.02,0.02,0.02,0.02,0.02]

#purchase price for grid electricity for each timestep t 
gec = [0.1,1,1,0.5,0.5,0.5,0.5,0.5,0.5,2,2,2]

#gas_price per KWh
gas_price = 0.001

#yearly discount rate
discount_rate_yearly = 0.04
discount_rate = compute_hourly_discount(discount_rate_yearly)

#-------------------------------
#---------VARIABLES-------------
#-------------------------------

# Trade between households
@variable(m, tr_from[1:N,1:T] >= 0)
@variable(m, tr_to[1:N,1:T] >= 0)


# Non-Consumption
@variable(m, snc[1:N,1:T] >= 0)

# PV-Production
@variable(m, spv[1:N,1:T] >= 0)

# CHP-Production
@variable(m, s_chp[1:N, 1:T] >= 0)

# Grid Imports
@variable(m, sgr[1:N,1:T] >= 0)

# Grid Exports
@variable(m, stg[1:N,1:T] >= 0)

# Shifted Consumption
@variable(m, ssc[1:N,0:T] >= 0)

# Gas Imports 
@variable(m, gas_import[1:N, 1:T] >= 0)

# Gas Production
@variable(m, gas_prod[1:N, 1:T] >= 0)

#----------STORAGE--------------
# To Gas Storage 
@variable(m, s_t_gst[1:N,1:T] >= 0)

# From Gas Storage
@variable(m, s_f_gst[1:N,1:T] >= 0)

# To Battery
@variable(m, s_t_li[1:N,1:T] >= 0)

# From Battery
@variable(m, s_f_li[1:N,1:T] >= 0)

#-----------INVESTMENTS---------
# PV-Capacity 
@variable(m, cp_pv[1:N] >= 0)

# Storage Capacity 
@variable(m, cp_li_ion[1:N] >= 0)

# Biogas CHP Capacity 
@variable(m, cp_chp[1:N] >= 0)

# Biogas Digester Capacity
@variable(m, cp_digester[1:N] >= 0)

# Gas Storage Capacity
@variable(m, cp_gas_st[1:N] >= 0)

#-------------------------------
#---------CONSTRAINTS-----------
#-------------------------------

#PV Supply Constraint
@constraint(m, pv_constr[i=1:N, t=1:T], spv[i,t] == cap_fr[t] * cp_pv[i])


#Supply Demand Constraint
@constraint(m, demand_constr[i=1:N, t=1:T],
    demand[i,t] == snc[i,t] + spv[i,t] + sgr[i,t] + s_chp[i,t]
    - stg[i,t] + tr_to[i,t] - tr_from[i,t]
    + s_f_li[i,t] - s_t_li[i,t] + ssc[i,t] - ssc[i,t-1])

#Trade Constraints
@constraint(m, trade_constr[t=1:T], sum(tr_from[i,t] for i=1:N) == sum(tr_to[i,t] for i=1:N))

#Shifted Consumption Constraint
@constraint(m, shift_constr[i=1:N], ssc[i,T] == 0)


#Supplied to Storage Constraint
@constraint(m, li_ion_constr[i=1:N], s_t_li[i,T] == 0)
@constraint(m, li_ion_cap_constr[i=1:N, t=1:T], s_t_li[i,t] <=  cp_li_ion[i] - (sum(s_t_li[i,u] for u=1:t) - (1/efficiency_li_ion) * sum(s_f_li[i,u] for u=1:t-1)))
@constraint(m, li_ion_level_constr[i=1:N, t=1:T], s_f_li[i,t] <= efficiency_li_ion * (sum(s_t_li[i,u] for u=1:t) - (1/efficiency_li_ion) * sum(s_f_li[i,u] for u=1:t-1)))

#Gas Use Constraint
@constraint(m, chp_cap[i=1:N, t=1:T], s_chp[i,t] <= cp_chp[i])
@constraint(m, chp_max_prod[i=1:N, t=1:T], s_chp[i,t] == efficiency_chp * s_f_gst[i,t])
@constraint(m, gas_use_constraint[i=1:N, t=1:T], s_f_gst[i,t] == s_chp[i,t] * (1/efficiency_chp))
@constraint(m, gas_storage_balance[i=1:N, t=1:T], s_f_gst[i,t] <= sum(s_t_gst[i,u] for u=1:t) - sum(s_f_gst[i,u] for u=1:t-1))
@constraint(m, gas_to_storage_const[i=1:N, t=1:T], s_t_gst[i,t] == gas_import[i,t] + gas_prod[i,t])

#Gas Constraint
@constraint(m, gas_import_cons[i=1:N, t=1:T; t%720 == 1], gas_import[i,t] <= (cp_gas_st[i] - sum(s_t_gst[i,u] for u=1:t) + sum(s_f_gst[i,u] for u=1:t-1)))
@constraint(m, gas_import_only_monthly[i=1:N, t=1:T, t%720 != 1], gas_import[i,t] == 0)

#Gas Digester Constraints
@constraint(m, gas_prod_const[i=1:N,t=1:T], gas_prod[i,t] <= cp_digester[i])

#Maximum Feed-In Constraint
@constraint(m, feed_in_const[i=1:N, t=1:T], stg[i,t] <= 10.)


#-------------------------------
#-----------OBJECTIVE-----------
#-------------------------------

function calculate_opex_fix(i) 
    1 / 24 * (
    opex_fix_pv * cp_pv[i] +
    opex_fix_li_ion * cp_li_ion[i] + 
    opex_fix_chp * cp_chp[i] + 
    opex_fix_gas_st * cp_gas_st[i] +
    opex_fix_digester * cp_digester[i]
)
end

@objective(m, Min, sum(
    capex_pv * cp_pv[i] + 
    capex_li_ion * cp_li_ion[i] +
    capex_chp * cp_chp[i] +
    capex_gas_st * cp_gas_st[i] +
    capex_digester * cp_digester[i]
    for i= 1:N) + 
    sum(
        ((sum(gas_price * gas_import[i,t] for i=1:N) + 
        sum(opex_var_chp * s_chp[i,t] for i=1:N) +
        sum(opex_var_li_ion * s_t_li[i,t] for i=1:N) +
        sum(gec[t]*sgr[i,t] for i=1:N) + 
        sum(ncc[i]*snc[i,t] for i=1:N) + 
        sum(scc[i]*ssc[i,t] for i=1:N) -
        sum(fit[t]*stg[i,t] for i=1:N) + 
        sum(calculate_opex_fix(i) for i=1:N)) / (1+discount_rate)^t) for t=1:T
    )
)

#-------------------------------
#------------SOLUTION-----------
#-------------------------------

status = solve(m)
println("")
println("----------------------")

println("INVESTMENT:" )
println("PV: ")
println(getvalue(cp_pv))
println("LI-ION: ")
println(getvalue(cp_li_ion))
println("CHP: ")
println(getvalue(cp_chp))
println("GAS STORAGE:")
println(getvalue(cp_gas_st))
println("GAS DIGESTER:")
println(getvalue(cp_digester))

println("----------------------")

println("Non-Consumption: ")
println(getvalue(snc))
println("----------------------")

println("PV-Production : ")
println(getvalue(spv))
println("----------------------")

println("Grid-Supply: ")
println(getvalue(sgr))
println("----------------------")

println("Grid-Feed-In: ")
println(getvalue(stg))
println("----------------------")

println("Trade From: ")
println(getvalue(tr_from))
println("----------------------")

println("Trade To: ")
println(getvalue(tr_to))
println("----------------------")

println("From Battery: ")
println(getvalue(s_f_li))
println("----------------------")

println("To Battery: ")
println(getvalue(s_t_li))
println("----------------------")

println("From Gas Storage: ")
println(getvalue(s_f_gst))
println("----------------------")

println("To Gas Storage: ")
println(getvalue(s_t_gst))
println("----------------------")

println("Battery Levels:")
println(map((i -> (sum(getvalue(s_t_li[i,t]) for t=1:T) - (1/efficiency_li_ion) * sum(getvalue(s_f_li[i,t]) for t=1:T))), [1:N]))
println("----------------------")

println("Gas Storage Levels: ")
println(map((i -> (sum(getvalue(s_t_gst[i,t]) for t=1:T) - sum(getvalue(s_f_gst[i,t]) for t=1:T))), [1:N]))
println("----------------------")

println("Shifted Consumption: ")
println(getvalue(ssc))
println("----------------------")
println("")

println("Objective value: ", getobjectivevalue(m))

output_data = Dict(
    "Objective" => getobjectivevalue(m),
    "N" => N, 
    "T" => T,
    "investment" => [
        Dict(
            "key" => "Solar PV",
            "value" => getvalue(cp_pv),
            "type" => "generation"
        ),
        Dict(
            "key" => "CHP",
            "value" => getvalue(cp_chp),
            "type" => "generation"
        ),
        Dict(
            "key" => "Gas Digester",
            "value" => getvalue(cp_digester),
            "type" => "other"
        ),
        Dict(
            "key" => "Li-Ion Battery",
            "value" => getvalue(cp_li_ion),
            "type" => "storage"
        ),
        Dict(
            "key" => "Gas Storage",
            "value" => getvalue(cp_gas_st),
            "type" => "storage"
        )
    ],
    "supply" => []
)

for i in [1:N]
    retval = [
        Dict(
            "key" => "Grid Consumption", 
            "value" => getvalue(sgr)[i,:],
            "type" => "positive"
        ),
        Dict(
            "key" => "PV-Production",
            "value" => getvalue(spv)[i,:],
            "type" => "positive"
        ),
        Dict(
            "key" => "CHP-Production",
            "value" => getvalue(s_chp)[i,:],
            "type" => "positive"
        ),
        Dict(
            "key" => "Shifted Consumption",
            "value" => getvalue(ssc)[i,:],
            "type" => "positive"
        ),
        Dict(
            "key" => "Omitted Consumption",
            "value" => getvalue(snc)[i,:],
            "type" => "positive"
        ),
        Dict(
            "key" => "From Battery",
            "value" => getvalue(s_f_li)[i,:],
            "type" => "positive"
        ),
        Dict(
            "key" => "Grid Feed-In",
            "value" => getvalue(stg)[i,:],
            "type" => "negative"
        ),
        Dict(
            "key" => "To Battery",
            "value" => getvalue(s_t_li)[i,:],
            "type" => "negative"
        ),
        Dict(
            "key" => "To Trade",
            "value" => getvalue(tr_to)[i,:],
            "type" => "negative"
        ),
        Dict(
            "key" => "From Trade",
            "value" => getvalue(tr_from)[i,:],
            "type" => "positive"
        )
    ]
    output_data["supply"] = retval
end 

json_string = JSON.json(output_data)

open("./output.json", "w") do f
    write(f, json_string)
end
