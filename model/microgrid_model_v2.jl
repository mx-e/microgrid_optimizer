using JuMP
using Gurobi
using JSON
using Distributions

include("microgrid_utils.jl")

m = Model(solver = GurobiSolver())
f = open("input.json")

input_data = JSON.parse(f)
close(f)
#-------------------------------
#---------SET-PARAMETERS--------
#-------------------------------

iterators = input_data["iterators"]

#number of households
U = iterators["U"]
#number of discountinous sets of timeslices
S = iterators["S"]
#number of timeslices in hours
T = iterators["T"]
#number of linear generation investment options
K = iterators["K"]
#number of discrete generation investment options
L = iterators["M"]
#number of linear storage investment options
M = iterators["L"]
#number of discrete storage investment options
N = iterators["N"]

otherParameters  = input_data["otherParameters"]

S_weights = otherParameters["S_weights"]
tradeC = otherParameters["tradeC"]

#-----HOUSEHOLDS---------------
H = []
for i in input_data["households"]
    j = 0
    while j < (i["opts"]["instances"])
        push!(H, constructHousehold(i, S, T))
        j+=1
    end
end

#-----INVESTMENT OPTIONS-------
GEN = []
for i in input_data["generationLinear"]
    push!(GEN, constructLinearGenerationDevice(i, S, T))
end

dGEN = []
for i in input_data["generationDiscrete"]
    push!(dGEN, constructDiscreteGenerationDevice(i, S, T))
end

ST = []
for i in input_data["storageLinear"]
    push!(ST, constructLinearStorageDevice(i))
end

dST = []
for i in input_data["storageDiscrete"]
    push!(dST, constructDiscreteStorageDevice(i))
end

#------GRID----------
GR = constructGrid(input_data["grid"], S, T)

#-------------------------------
#---------VARIABLES-------------
#-------------------------------

# Trade between households
@variable(m, toTR[1:U,1:S,1:T] >= 0)
@variable(m, fromTR[1:U,1:S,1:T] >= 0)

# Generation
if K > 0
    @variable(m, genS[1:U,1:K,1:S,1:T] >= 0)
end
if M > 0
    @variable(m, dgenS[1:U,1:M,1:S,1:T] >= 0)
end

# Storage
if L > 0
    @variable(m, fromST[1:U,1:L,1:S,1:T] >= 0)
    @variable(m, toST[1:U,1:L,1:S,1:T] >= 0)
end
if N > 0
    @variable(m, fromDST[1:U,1:N,1:S,1:T] >= 0)
    @variable(m, toDST[1:U,1:N,1:S,1:T] >= 0)
end

# Non-Consumption
@variable(m, ncS[1:U,1:S,1:T] >= 0)

# Shifted Consumption
@variable(m, toSC[1:U,1:S,1:T] >= 0)
@variable(m, fromSC[1:U,1:S,1:T] >= 0)

# Grid Imports/Exports
@variable(m, toGR[1:U,1:S,1:T] >= 0)
@variable(m, fromGR[1:U,1:S,1:T] >= 0)

#-----------INVESTMENTS---------
#Generation
if K > 0
    @variable(m, HuGENk[1:U,1:K] >= 0)
end
if M > 0
    @variable(m, HuDGENm[1:U,1:M] >= 0, Int)
end

#Storage
if L > 0
    @variable(m, HuSTl[1:U, 1:L] >= 0)
end
if N > 0
    @variable(m, HuDSTn[1:U, 1:N] >= 0, Int)
end

#-------------------------------
#---------CONSTRAINTS-----------
#-------------------------------

#Generation
#linear
if K > 0
    @constraint(m, genConstr[u=1:U, k=1:K, s=1:S, t=1:T], genS[u,k,s,t] 
    <= min((GEN[k].EFFel * GEN[k].maxFl[s,t]), 1.0) * HuGENk[u,k] * GEN[k].PR)
end
#discrete 
if M > 0
    @constraint(m, dgenConstr[u=1:U, m=1:M, s=1:S, t=1:T], dgenS[u,m,s,t] 
    <= min(dGEN[m].EFFel * dGEN[m].maxFl[s,t] *dGEN[m].CAP, 1.0) * HuGENk[u,k] * dGEN[m].PR * dGEN[m].CAP)
end

#Storage
#linear
if L > 0
    @constraint(m, flowConstrTO[u=1:U, l=1:L, s=1:S, t=1:T], toST[u,l,s,t] <= ST[l].maxPplus * HuSTl[u,l])
    @constraint(m, flowConstrFROM[u=1:U, l=1:L, s=1:S, t=1:T], fromST[u,l,s,t] <= ST[l].maxPminus * HuSTl[u,l])

    @constraint(m, balanceConstr[u=1:U, l=1:L, s=1:S], sum(ST[l].EFFplus * toST[u,l,s,t] - ST[l].EFFminus * fromST[u,l,s,t] for t=1:T) == 0.0)
    
    @constraint(m, capConstr[u=1:U, l=1:L, s=1:S, t=1:T], toST[u,l,s,t] * ST[l].EFFplus 
    <= sum(-ST[l].EFFplus * toST[u,l,s,x] + ST[l].EFFminus * fromST[u,l,s,x] for x=1:(t-1)))

    @constraint(m, lvlConstr[u=1:U, l=1:L, s=1:S, t=1:T], fromST[u,l,s,t] * ST[l].EFFminus
    <= HuSTl[u,l] + sum(ST[l].EFFplus * toST[u,l,s,x] - ST[l].EFFminus * fromST[u,l,s,x] for x=1:(t-1)))
end
#discrete
if N > 0
    @constraint(m, disc_flowConstrTO[u=1:U, n=1:N, s=1:S, t=1:T], toDST[u,n,s,t] <= dST[n].maxPplus * HuDSTn[u,n] * dST[n].CAP)
    @constraint(m, disc_flowConstrFROM[u=1:U, n=1:N, s=1:S, t=1:T], fromDST[u,n,s,t] <= dST[n].maxPminus * HuDSTn[u,n] * dST[n].CAP)

    @constraint(m, disc_balanceConstr[u=1:U, n=1:N, s=1:S], sum(dST[n].EFFplus * toDST[u,n,s,t] - dST[n].EFFminus * fromDST[u,n,s,t] for t=1:T) == 0.0)
    
    @constraint(m, disc_capConstr[u=1:U, n=1:N, s=1:S, t=1:T], toDST[u,n,s,t] * dST[n].EFFplus 
    <= sum(-dST[n].EFFplus * toDST[u,n,s,x] + dST[n].EFFminus * fromDST[u,n,s,x] for x=1:(t-1)))

    @constraint(m, disc_lvlConstr[u=1:U, n=1:N, s=1:S, t=1:T], fromDST[u,n,s,t] * dST[n].EFFminus
    <= HuDSTn[u,n] * dST[n].CAP + sum(dST[n].EFFplus * toDST[u,n,s,x] - dST[n].EFFminus * fromDST[u,n,s,x] for x=1:(t-1)))
end

#Trade
@constraint(m, tradeBalanceConstr[s=1:S, t=1:T], sum(toTR[u,s,t] - fromTR[u,s,t] for u=1:U) == 0)

#Demand
@constraint(m, shiftableDemConstr[u=1:U, s=1:S, t=1:T], toSC[u,s,t] <= H[u].DEM[s,t,2] + fromSC[u,s,t])
@constraint(m, curtailableDemConstr[u=1:U, s=1:S, t=1:T], ncS[u,s,t] <= H[u].DEM[s,t,3])

@constraint(m, noShiftingAtEndConstr[u=1:U, s=1:S], toSC[u,s,T] == 0.0)
@constraint(m, consumeShiftedConstr[u=1:U, s=1:S, t=2:T], fromSC[u,s,t] == toSC[u,s,t-1])

#Grid
@constraint(m, gridSupplyConstr[s=1:S, t=1:T], sum(fromGR[u,s,t] - toGR[u,s,t] for u=1:U) <= GR.maxS[s,t])
@constraint(m, gridDemandContstr[s=1:S, t=1:T], sum(toGR[u,s,t] - fromGR[u,s,t] for u=1:U) <= GR.maxD[s,t])

#Power Balance
function conditionalSum(X, var, u, s, t)
    if X > 0
        return sum(var[u,x,s,t] for x=1:X)
    else
        return 0.0
    end
end


@constraint(m, powerBalanceConstr[u=1:U, s=1:S, t=1:T], H[u].DEM[s,t,1] + H[u].DEM[s,t,2] + H[u].DEM[s,t,3]
== fromGR[u,s,t] - toGR[u,s,t] + fromTR[u,s,t] - toTR[u,s,t] - fromSC[u,s,t] + toSC[u,s,t]
+ conditionalSum(K, genS, u, s, t) 
# + conditionalSum(M, dgenS, u, s, t) 
# + conditionalSum(L, fromST, u, s, t) - conditionalSum(L, toST, u, s, t) 
+ conditionalSum(N, fromDST, u, s, t) - conditionalSum(N, toDST, u, s, t))


#-------------------------------
#-----------OBJECTIVE-----------
#-------------------------------
C_Investment_GEN = 0.0
C_Investment_dGEN = 0.0
C_Investment_ST = 0.0
C_investment_dST = 0.0
C_Operation_GEN = 0.0
C_Operation_dGEN = 0.0
C_Dispatch_GEN = 0.0
C_Dispatch_dGEN = 0.0

if K > 0
    C_Investment_GEN = sum(
        sum(adjust_capex(GEN[k].cCap, 25, T*S) * HuGENk[u,k] for k=1:K)
    for u=1:U)
    C_Operation_GEN  = sum(
        sum(adjust_opex(GEN[k].cOpFix, S*T) * HuGENk[u,k] * S * T for k=1:K)
    for u=1:U)
    C_Dispatch_GEN = sum(
        sum(GEN[k].cOpVar * genS[u,k,s,t] / GEN[k].EFFel for k=1:K) * S_weights[s]
    for u=1:U, s=1:S, t=1:T)
end

if M > 0
    C_Investment_dGEN = sum(
        um(adjust_capex(dGEN[m].cCap,15,T*S) * HuDGENm[u,m] for m=1:M)
    for u=1:U)
    C_Operation_dGEN = sum(
        sum(adjust_opex(dGEN[m].cOpFix, S*T) * HuDGENm[u,m] * S * T for m=1:M)
    for u=1:U)
    C_Dispatch_dGEN = sum(
        sum(dGEN[m].cOpVar * dgenS[u,m,s,t] / dGEN[m].EFFel for m=1:M) * S_weights[s]
    for u=1:U, s=1:S, t=1:T)
end

if L > 0
    C_Investment_ST = sum(
        sum(adjust_capex(ST[l].cCap,10,S*T) * HuSTl[u,l] for l=1:L)
    for u=1:U)
end

if N > 0
    C_investment_dST = sum(
        sum(adjust_capex(dST[n].cCap,10,S*T) * HuDSTn[u,n] for n=1:N)
    for u=1:U)
end

C_Investment = C_Investment_GEN + C_Investment_dGEN + C_Investment_ST + C_investment_dST

C_Operation = C_Operation_GEN + C_Operation_dGEN

C_Dispatch = sum(
    (GR.gridC[s,t] * fromGR[u,s,t] - GR.feedC[s,t] * toGR[u,s,t] 
    + H[u].curtP * ncS[u,s,t] + H[u].shiftP * toSC[u,s,t] + toTR[u,s,t] * tradeC) * S_weights[s]
    for u=1:U, s=1:S, t=1:T) + C_Dispatch_GEN + C_Dispatch_dGEN

@objective(m, Min, C_Investment + C_Operation + C_Dispatch)

#-------------------------------
#------------SOLUTION-----------
#-------------------------------
println("Starting to solve...")
status = solve(m)
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

println("Battery Levels:")
# println(map((i -> (sum(getvalue(s_t_li[i,t]) for t=1:T) - (1/efficiency_li_ion) * sum(getvalue(s_f_li[i,t]) for t=1:T))), [1:N]))
# println("----------------------")

# println("Gas Storage Levels: ")
# println(map((i -> (sum(getvalue(s_t_gst[i,t]) for t=1:T) - sum(getvalue(s_f_gst[i,t]) for t=1:T))), [1:N]))
# println("----------------------")

println("Shifted Consumption: ")
println(getvalue(toSC))
println(getvalue(fromSC))
println("----------------------")
println("")

println("Objective value: ", getobjectivevalue(m))

# output_data = Dict(
#     "Objective" => getobjectivevalue(m),
#     "N" => N, 
#     "T" => T,
#     "investment" => [
#         Dict(
#             "key" => "Solar PV",
#             "value" => getvalue(cp_pv),
#             "type" => "generation",
#             "color" => "#ffeb3b"
#         ),
#         Dict(
#             "key" => "CHP",
#             "value" => getvalue(cp_chp),
#             "type" => "generation",
#             "color" => "#e54213"
#         ),
#         Dict(
#             "key" => "Gas Digester",
#             "value" => getvalue(cp_digester),
#             "type" => "other",
#             "color" => "#24693d"
#         ),
#         Dict(
#             "key" => "Li-Ion Battery",
#             "value" => getvalue(cp_li_ion),
#             "type" => "storage",
#             "color" => "#8e8eb5"
#         ),
#         Dict(
#             "key" => "Gas Storage",
#             "value" => getvalue(cp_gas_st),
#             "type" => "storage",
#             "color" => "#ae123a"
#         )
#     ],
#     "supply" => []
# )

# for i in [1:N]
#     retval = [
#         Dict(
#             "key" => "Grid Consumption", 
#             "value" => getvalue(sgr)[i,:],
#             "type" => "positive",
#             "color" => "#b7c7cf"
#         ),
#         Dict(
#             "key" => "PV-Production",
#             "value" => getvalue(spv)[i,:],
#             "type" => "positive",
#             "color" => "#ffeb3b"
#         ),
#         Dict(
#             "key" => "CHP-Production",
#             "value" => getvalue(s_chp)[i,:],
#             "type" => "positive",
#             "color" => "#e54213"
#         ),
#         Dict(
#             "key" => "Shifted Consumption",
#             "value" => getvalue(ssc)[i,:],
#             "type" => "positive",
#             "color" => "#00726c"
#         ),
#         Dict(
#             "key" => "Omitted Consumption",
#             "value" => getvalue(snc)[i,:],
#             "type" => "positive",
#             "color" => "#71c9c1"
#         ),
#         Dict(
#             "key" => "From Battery",
#             "value" => getvalue(s_f_li)[i,:],
#             "type" => "positive",
#             "color" => "#8e8eb5"
#         ),
#         Dict(
#             "key" => "Grid Feed-In",
#             "value" => getvalue(stg)[i,:],
#             "type" => "negative",
#             "color" => "#a2b0b8"
#         ),
#         Dict(
#             "key" => "To Battery",
#             "value" => getvalue(s_t_li)[i,:],
#             "type" => "negative",
#             "color" => "#727397"
#         ),
#         Dict(
#             "key" => "To Trade",
#             "value" => getvalue(tr_to)[i,:],
#             "type" => "negative",
#             "color" => "#9526b7"
#         ),
#         Dict(
#             "key" => "From Trade",
#             "value" => getvalue(tr_from)[i,:],
#             "type" => "positive",
#             "color" => "#77209b"
#         )
#     ]
#     output_data["supply"] = retval
# end 

# json_string = JSON.json(output_data)

# open("./output.json", "w") do f
#     write(f, json_string)
# end
