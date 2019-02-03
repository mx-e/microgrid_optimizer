using JuMP
using Gurobi
using JSON
using Distributions

include("microgrid_utils.jl")

mod = Model(solver = GurobiSolver(TimeLimit=900.0))
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
L = iterators["L"]
#number of linear storage investment options
M = iterators["M"]
#number of discrete storage investment options
N = iterators["N"]

otherParameters  = input_data["otherParameters"]

S_weights = otherParameters["S_weights"]
S_weights = normalize_weights(S_weights)

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
@variable(mod, toTR[1:U,1:S,1:T] >= 0)
@variable(mod, fromTR[1:U,1:S,1:T] >= 0)

# Generation
if K > 0
    @variable(mod, genS[1:U,1:K,1:S,1:T] >= 0)
end
if M > 0
    @variable(mod, dgenS[1:U,1:M,1:S,1:T] >= 0)
end

# Storage
if L > 0
    @variable(mod, fromST[1:U,1:L,1:S,1:T] >= 0)
    @variable(mod, toST[1:U,1:L,1:S,1:T] >= 0)
end
if N > 0
    @variable(mod, fromDST[1:U,1:N,1:S,1:T] >= 0)
    @variable(mod, toDST[1:U,1:N,1:S,1:T] >= 0)
end

# Non-Consumption
@variable(mod, ncS[1:U,1:S,1:T] >= 0)

# Shifted Consumption
@variable(mod, toSC[1:U,1:S,1:T] >= 0)
@variable(mod, fromSC[1:U,1:S,1:T] >= 0)

# Grid Imports/Exports
@variable(mod, toGR[1:U,1:S,1:T] >= 0)
@variable(mod, fromGR[1:U,1:S,1:T] >= 0)

#-----------INVESTMENTS---------
#Generation
if K > 0
    @variable(mod, HuGENk[1:U,1:K] >= 0)
end
if M > 0
    @variable(mod, HuDGENm[1:U,1:M] >= 0, Int)
end

#Storage
if L > 0
    @variable(mod, HuSTl[1:U, 1:L] >= 0)
end
if N > 0
    @variable(mod, HuDSTn[1:U, 1:N] >= 0, Int)
end

#-------------------------------
#---------CONSTRAINTS-----------
#-------------------------------

#Generation
#linear
if K > 0
    @constraint(mod, genConstr[u=1:U, k=1:K, s=1:S, t=1:T], genS[u,k,s,t] 
    <= min((GEN[k].EFFel * GEN[k].maxFl[t,s]), 1.0) * HuGENk[u,k] * GEN[k].PR)
end
#discrete 
if M > 0
    @constraint(mod, dgenConstr[u=1:U, m=1:M, s=1:S, t=1:T], dgenS[u,m,s,t] 
    <= min(dGEN[m].EFFel * dGEN[m].maxFl[t,s], 1.0) * HuDGENm[u,m] * dGEN[m].PR * dGEN[m].CAP)
end

#Storage
#linear
if L > 0
    @constraint(mod, flowConstrTO[u=1:U, l=1:L, s=1:S, t=1:T], toST[u,l,s,t] <= ST[l].maxPplus * HuSTl[u,l])
    @constraint(mod, flowConstrFROM[u=1:U, l=1:L, s=1:S, t=1:T], fromST[u,l,s,t] <= ST[l].maxPminus * HuSTl[u,l])

    @constraint(mod, balanceConstr[u=1:U, l=1:L, s=1:S], sum(ST[l].EFFplus * toST[u,l,s,t] - ST[l].EFFminus * fromST[u,l,s,t] for t=1:T) == 0.0)
    
    @constraint(mod, capConstr[u=1:U, l=1:L, s=1:S, t=1:T], toST[u,l,s,t] * ST[l].EFFplus 
    <= sum(-ST[l].EFFplus * toST[u,l,s,x] + ST[l].EFFminus * fromST[u,l,s,x] for x=1:(t-1)))

    @constraint(mod, lvlConstr[u=1:U, l=1:L, s=1:S, t=1:T], fromST[u,l,s,t] * ST[l].EFFminus
    <= HuSTl[u,l] + sum(ST[l].EFFplus * toST[u,l,s,x] - ST[l].EFFminus * fromST[u,l,s,x] for x=1:(t-1)))
end
#discrete
if N > 0
    @constraint(mod, disc_flowConstrTO[u=1:U, n=1:N, s=1:S, t=1:T], toDST[u,n,s,t] <= dST[n].maxPplus * HuDSTn[u,n])
    @constraint(mod, disc_flowConstrFROM[u=1:U, n=1:N, s=1:S, t=1:T], fromDST[u,n,s,t] <= dST[n].maxPminus * HuDSTn[u,n])

    @constraint(mod, disc_balanceConstr[u=1:U, n=1:N, s=1:S], sum(dST[n].EFFplus * toDST[u,n,s,t] - dST[n].EFFminus * fromDST[u,n,s,t] for t=1:T) == 0.0)
    
    @constraint(mod, disc_capConstr[u=1:U, n=1:N, s=1:S, t=1:T], toDST[u,n,s,t] * dST[n].EFFplus 
    <= sum(-dST[n].EFFplus * toDST[u,n,s,x] + dST[n].EFFminus * fromDST[u,n,s,x] for x=1:(t-1)))

    @constraint(mod, disc_lvlConstr[u=1:U, n=1:N, s=1:S, t=1:T], fromDST[u,n,s,t] * dST[n].EFFminus
    <= HuDSTn[u,n] * dST[n].CAP + sum(dST[n].EFFplus * toDST[u,n,s,x] - dST[n].EFFminus * fromDST[u,n,s,x] for x=1:(t-1)))
end

#Trade
@constraint(mod, tradeBalanceConstr[s=1:S, t=1:T], sum(toTR[u,s,t] - fromTR[u,s,t] for u=1:U) == 0)

#Demand
@constraint(mod, shiftableDemConstr[u=1:U, s=1:S, t=1:T], toSC[u,s,t] <= H[u].DEM[s,t,2] + fromSC[u,s,t])
@constraint(mod, curtailableDemConstr[u=1:U, s=1:S, t=1:T], ncS[u,s,t] <= H[u].DEM[s,t,3])

@constraint(mod, noShiftingAtEndConstr[u=1:U, s=1:S], toSC[u,s,T] == 0.0)
@constraint(mod, consumeShiftedConstr[u=1:U, s=1:S, t=2:T], fromSC[u,s,t] == toSC[u,s,t-1])

#Grid
@constraint(mod, gridSupplyConstr[s=1:S, t=1:T], sum(fromGR[u,s,t] - toGR[u,s,t] for u=1:U) <= GR.maxS[s,t])
@constraint(mod, gridDemandContstr[s=1:S, t=1:T], sum(toGR[u,s,t] - fromGR[u,s,t] for u=1:U) <= GR.maxD[s,t])

#Power Balance
function conditionalSum(X, var, u, s, t)
    if X > 0
        return sum(var[u,x,s,t] for x=1:X)
    else
        return 0.0
    end
end


@constraint(mod, powerBalanceConstr[u=1:U, s=1:S, t=1:T], H[u].DEM[1,t,s] + H[u].DEM[2,t,s] + H[u].DEM[3,t,s]
== fromGR[u,s,t] - toGR[u,s,t] + fromTR[u,s,t] - toTR[u,s,t] - fromSC[u,s,t] + toSC[u,s,t]
#+ conditionalSum(K, genS, u, s, t) 
+ conditionalSum(M, dgenS, u, s, t) 
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
        sum(adjust_capex(GEN[k].cCap, GEN[k].tLife, S*T) * HuGENk[u,k] for k=1:K)
    for u=1:U)
    C_Operation_GEN  = sum(
        sum(adjust_opex(GEN[k].cOpFix, S*T) * HuGENk[u,k] for k=1:K)
    for u=1:U)
    C_Dispatch_GEN = sum(
        sum((GEN[k].cOpVar/ GEN[k].EFFel) * genS[u,k,s,t]  for k=1:K) * S_weights[s]
    for u=1:U, s=1:S, t=1:T)
end

if M > 0
    C_Investment_dGEN = sum(
        sum(adjust_capex(dGEN[m].cCap, dGEN[m].tLife, T*S) * HuDGENm[u,m] for m=1:M)
    for u=1:U)
    C_Operation_dGEN = sum(
        sum(adjust_opex(dGEN[m].cOpFix, S*T) * HuDGENm[u,m] for m=1:M)
    for u=1:U)
    C_Dispatch_dGEN = sum(
        sum((dGEN[m].cOpVar/dGEN[m].EFFel) * dgenS[u,m,s,t] for m=1:M) * S_weights[s]
    for u=1:U, s=1:S, t=1:T)
end

if L > 0
    C_Investment_ST = sum(
        sum(adjust_capex(ST[l].cCap, ST[l].tLife, S*T) * HuSTl[u,l] for l=1:L)
    for u=1:U)
end

if N > 0
    C_investment_dST = sum(
        sum(adjust_capex(dST[n].cCap, dST[n].tLife, S*T) * HuDSTn[u,n] for n=1:N)
    for u=1:U)
end

C_Investment = C_Investment_GEN + C_Investment_dGEN + C_Investment_ST + C_investment_dST

C_Operation = C_Operation_GEN + C_Operation_dGEN

C_Dispatch = sum(
    (GR.gridC[s,t] * fromGR[u,s,t] - GR.feedC[s,t] * toGR[u,s,t] 
    + H[u].curtP * ncS[u,s,t] + H[u].shiftP * toSC[u,s,t] + toTR[u,s,t] * tradeC) * S_weights[s]
    for u=1:U, s=1:S, t=1:T) + C_Dispatch_GEN + C_Dispatch_dGEN

@objective(mod, Min, C_Investment + C_Operation + C_Dispatch)

#-------------------------------
#------------SOLUTION-----------
#-------------------------------
println("Starting to solve...")
status = solve(mod)

#print_results()
export_results(input_data)
