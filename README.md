# Literature 


Key Questions:

- What is essential in designing a model of an energy market ? 

- What are best practices ?

- What aspects have other authors already examined exaustively ? 

- What has not already been examined exhaustively ? 

-------

## Summary of findings: 


-------

//TODO

-------


**Paper name:** "Designing microgrid energy markets A case study: The Brooklyn Microgrid"

Mengelkamp

**Focus / Key Aspects examined** Focuses on the design of a physical or virtual microgrid in general, defines essential functions.

**Summary of aspects which are interesting:** Lists the seven critical components of a working microgrid energy system: 

- Microgrid setup: A clear objective, definition of market participants, form of energy traded

- Grid Connection: One or several connection points towards the superordinate grid 

- Information System: A high-performing information system [10] is needed to con- nect all market participants, provide the market platform, provide market access, and monitor the market operations.

- Market Mechanism: The market mechanism comprises the market’s allocation and payment rules, and provides an employable bidding language and a clearly defined bidding format

- Pricing Mechanism: The pricing mechanism is implemented via the market mecha- nism (C4) and aims at efficiently allocating energy supply and demand.

- Energy Management System: The EMTS’s main objective is to automatically secure the energy supply for a market participant while implementing a specific bid- ding strategy.

- Regulation: The regulation determines how microgrid energy markets fit into the current energy policy.

-------

**Paper name:** "Optimal scheduling of a renewable micro-grid in an isolated load area using mixed-integer linear programming"

Morais et al

**Focus / Key Aspects examined** Model of a simple isolated microgrid with PV and Wind as well as thermal solar as generation and thermal and battery storage. 


**Summary of aspects which are interesting:** 
Using full foresight for a 24 hour dispatch. Minimizing cost. Modelled in GAMS. Very simple model with only 1 consumer. 24 time slices. 

-------

**Book Name** "Microgrids - Architecture and Control"

Edited by: Hatziargyriou


**Focus / Key Aspects examined** The book on Microgrids (for engineers)

**Summary of aspects which are interesting:** 
Definition of Microgrids and wht is not a microgrid: 

"Microgrids comprise LV distribution systems with distributed energy resources (DER) (micro- turbines, fuel cells, PV, etc.) together with storage devices (flywheels, energy capacitors and batteries) and flexible loads. Such systems can be operated in a non-autonomous way, if interconnected to the grid, or in an autonomous way, if disconnected from the main grid. The operation of microsources in the network can provide distinct benefits to the overall system performance, if managed and coordinated efficiently."

Referenced: 
1. More Microgrids (2006–2009) Advanced Architectures and Control Concepts for More Microgrids, FP6 STREP, Contract no.: PL019864., http://www.microgrids.eu.


-------

**Paper name:** 
A mixed integer linear programming approach for optimal DER portfolio, sizing, and placement in multi-energy microgrids

Mashayekh et al

**Focus / Key Aspects examined**  
Focuses on the difference between single-node and multi-node design and the enrgy flows between the nodes (with the corresponding constraints of transmission volume)

considers heating, cooling, and electricity 

**Summary of aspects which are interesting:** 
"this paper presents an optimization model formulated as a mixed-integer linear program, which deter- mines the optimal technology portfolio, the optimal technology placement, and the associated optimal dispatch, in a microgrid with multiple energy types"

single node approaches may result in sub-optimal DER portfolio and an underestimation of the investment costs as shown in case study were optimal investment and portfolios differ

uses existing model (DER-CAM developed by Lawrence Berkeley National Laboratory)

3 typical days per month in hourly resolution -> 864 time steps

objective is to minimize the overall investment and operation cost 

case study in 2 variants, single- and multi-node (4 nodes)

some investment options discrete some linear 


-------

**Paper name:** 
 An energy integrated, multi-microgrid, MILP (mixed-integer linear programming) approach for residential distributed energy system planning e A South Australian case-study

Wouters, Fraga, James


**Focus / Key Aspects examined**  Modeling of electricity, heating and cooling for case study in south Australia, modeling in GAMS, multiple options for DG and storage


**Summary of aspects which are interesting:** 

The model is formulated as an MILP and the optimisation is executed in GAMS 

also allows for spacial distribution of generation capacities 

inputs: environmental factors (solar wind etc.), given infrastructure (distribution), cost data for investment costs and tariffs, regulation (FITs etc.), energy demands

determines: total annualised cost, optimal design (capacity AND allocation), optimal dispatch
objective: cost minimization

assumptions in accordance with other literature (//TODO list those papers too):

1. Constant energy conversion efficiencies are used for the technologies. In reality, the efficiency depends on the rating and loading of the unit.
2. Ramp-up and ramp-down times of the units are neglected since the latter are optimally dispatched to ensure full functionality when required.
3. Reliability and availability are not explicitly addressed since the combination of the selected units is assumed to meet the local demand at all times, excluding scheduled and unscheduled outages and spare units.
4. Pipelines are assumed to have no inherent OM cost as these would arise from pumps in the network. Since the pipelines are very short ( 100 m), no pumps are assumed to be installed in the network.
5. MG operation is assumed to be installed in a neighbourhood with an existing electrical infrastructure. The protection systems are thus already in place and the MG investment cost is there- fore limited to the central control unit.

5 nodes are modeled

1 day in 3 seasons are modeled -> 72 time slices 


-------

**Paper name:** 
 A mixed integer linear programming model for the energy management problem of microgrids

Tenfen, Finardi


**Focus / Key Aspects examined**  Focus is on microturbines and fuel cells, ramp up /down times and other techical constraints typical for these technologies are taken into account as constraints, also PV, WInd and battery storage considered.


**Summary of aspects which are interesting:** 
objective is first cost reduction, with constraint on greenhouse gases 

forecast horizon is 24h in 1min timesteps -> 1440 timeslices 


-------


**Paper name:** 
Modelling high level system design and unit commitment for a microgrid

Hawkes, Leach


**Focus / Key Aspects examined**  Focus is on high level system design and corresponding unit commitment of generators and storage within a microgrid

**Summary of aspects which are interesting:** 
The model developed is applied to a set of United Kingdom commercial load profiles, under best current estimates of energy prices and technology capital costs, to determine investment attractiveness of the microgrid

//TODO investigate DER_CAM and HOMER

minimzes energy cost

Physically, the microgrid considered in this study consists of the following components;
Up to three CHP generators;
Wind turbines up to 600 kWe;
Photovoltaic arrays;
Up to one boiler per site;
Electricity storage (e.g. a lead–acid battery);
Thermal energy storage;
Thermal exchange system in defined cases to allow heat sharing between particular sites;

Perhaps the most important resource not considered here is that of load, as load shifting or load reduction can be a valuable tool to reduce costs and environmental impact, particularly in the case of the microgrid, where peak demand when operating autonomously from the “macrogrid” has a profound influence on economics.

3 nodes 

12 days of hourly data -> 288 time slices

This model adds additional constraints to those currently existing in the literature in that it explicitly defines the amount of time per year that the microgrid would be expected to operate in “islanded” mode

Finally, the differing optimal operation schedules between grid-connected and islanded systems were presented, pointing out that the islanded microgrid represents a far more constrained system and therefore exhibits a more complex cost-optimal dispatch schedule. Observation of participants’ operating schedules indicates that cooperative action rather than pure self interest provides the best economic outcome for the microgrid, indicating that development of a fair settlement system between microgrid participants should be developed. Game theory provides the necessary tools to carry out such an analysis.


-------

**Paper name:** 
Optimal design and operation of distributed energy systems: Application to Greek residential sector

Mehleri et al


**Focus / Key Aspects examined**  takes into account site energy loads, local climate data, utility tariff structure, characteristics of the candidate DER technologies (technical and financial) as well as geographical aspects. The optimal integrated DER system is selected by minimising the total energy cost while guaranteeing reliable system operation.

**Summary of aspects which are interesting:** 

//TODO: investigate HEATMAP

In the optimisation problem, the following data are given:
 - Dwellings, distances between them, average 24-h hourly electricity and heat profiles for each month of the year

 - Cost of PV unit, back-up boiler, CHP as a function of its capacity, cost of the heating pipeline, cost of thermal storage tanks, cost of installing a microgrid.

 - Technical characteristics of DER technologies

 - Average 24-h hourly electricity tariffs for each month of the year, gas price, price of selling excess electricity

 - Average 24-h hourly solar irradiance profile for each month of the year

 Determines: 

 - Allocations and capacities of DER technologies

 - Pipeline heating network in the neighbourhood

 - Average 24-h hourly electricity and heat production profiles per dwelling for each month of the year

 - Average 24-h hourly heat transfer quantities through pipeline network for each month of the year

 - Average 24-h hourly flows of electricity between grid and dwellings and among dwellings for each month of the year

 - Storage tank capacities

 So as to minimise the total annualised cost

 example contains 5 nodes, 24 timeslices


-------

**Paper name:** 
Optimisation based design of a district energy system for an eco-town in the United Kingdom

Weber & Shaw


**Focus / Key Aspects examined** focus of this paper is to present the DESDOP tool; District Energy System Design and Optimisation 


**Summary of aspects which are interesting:** 
definition of appropriate combinations of technologies, including both renewable and non-renewable energy powered technologies, to meet the energy requirements of a small city. 

Moreover, a vast choice of technologies powered by renewable as well as non-renewable energy shall be considered, to understand how both these types of technologies can be best combined to help decrease CO2 emissions

ASSUMPTIONS MADE: 

The following assumptions have been made to run DESDOP:
1. Space heating and domestic hot water can be provided directly or via distributed storage tanks (except for gas boilers that generate the heat directly as and when it is needed).

2. Thermal storage losses are 10% of the stored energy [5].

3. The average heat losses in the heating distribution network are 5% of the distributed heat [34]
4. The design supply temperature for the heating network is 70 °C and the return temperature is 40 °C. These temperatures allow for the network to meet domestic hot water requirements10

5. The required supply temperature for space heating in the dwellings is 35 °C (which is sufficient for underfloor heating) and 60 °C for domestic hot water.

6. The total available area for solar thermal collectors and PV cells is the total roof area of the buildings at the node11

7. For wind turbines, a maximum total rated output of 10 MW for the eco-town has been set, with a maximum of 500 kW per turbine.

8. The grid and the gas network (also used for cooking) are already existing and connected to the eco-town.

9. The price of grid electricity averages 0.13 £/kWh during the day and 0.06 £/kWh during the night.

10. The price of electricity sold back to the grid (for instance whenever PV cells or wind turbines generate more electricity than currently required in the eco-town) has been set to 0.01 £/kWh. This reflects the situation as it stands for small- and medium-scale technologies in the UK at the time of writing.

11. The price of natural gas is 0.04 £/kWh throughout the day.

12. Because of the small energy services to be provided to the station, pubs, restaurants and corner shops, the nodes hosting these buildings have been aggregated with their nearest neighbouring node (see Fig. 8: the nodes encircled are aggregated into one single node per circle). This allows improving the resolution time.

13. The CO2 emissions linked to natural gas are 0.194 kg-CO2/kWh, and the CO2 emissions linked to grid electricity are 0.422 kg-CO2/kWh [36].

14. The interest rate is 7% and takes into account a risk factor [37].

For each scenario the minimisation of the overall annual costs (including investment, maintenance and operation) was always chosen as the objective function

Various sensitivity analyses have shown that as far as electricity is concerned, despite the promising development of renewable energy powered technologies (wind turbines and PV cells), the grid (and therefore nuclear or fossil fuel based electricity) remains essential, unless electricity storage comes of age

 Finally, it is the belief of the authors that optimisation tools like the one presented in this paper only become really useful if they can be disseminated, which in turn means the development of a user friendly version of the tool.


 //TODO investigate IES software for modelling building demand profiles 
 
 
-------

 **Paper name:** 
A MILP model for integrated plan and evaluation of distributed energy systems

Ren & Gao

**Focus / Key Aspects examined** Given the site’s energy loads, local climate data, utility tariff structure, and information (both technical and financial) on candidate DER technologies, the model minimizes overall energy cost for a test year by selecting the units to install and determining their operating schedules


**Summary of aspects which are interesting:** 
The installed DER capacity is not proportional to the scale of energy demand. Furthermore, the economic and environmental performances illustrate uncertain trend with various demand scales, although the variation range is marginal.


-------

 **Paper name:**  Distributed generation: An empirical analysis of primary motivators

 Carley

 **Focus / Key Aspects examined** which types of utilities are more likely to adopt distributed generation systems and, additionally, which factors motivate decisions of adoption and system capacity size


**Summary of aspects which are interesting:** 
private utilities are significantly more inclined to adopt distributed generation than cooperatives and other types of public utilities. We also find evidence that interconnection standards and renewable portfolio standards effectively encourage consumer-owned distributed generation, while market forces associated with greater market competition encourage utility-owned distributed generation

- DG systems offer cost savings due to large efficiency gains and reduced or no transmission and distribution costs;
- DG systems can potentially provide security, reliability, and availability improvements over conventional systems;
- DG technologies have the ability to reduce peak electricity demand and concurrently reduce grid operator costs through the provision of ancillary services and interruptible load operations; and
- DG deployment could potentially defer transmission and distribution infrastructure investments and also reduce the vulnerability of an over-stressed transmission system.

Evidence suggests that private utilities are most able to take advantage of these benefits. Kwoka (2005), for instance, has demonstrated that private utilities provide on average lower power reliability than public utilities


------- 

**Paper name:** Optimization framework for distributed energy systems with integrated electrical grid constraints

Morjav, Evins, Carmeliet

**Focus / Key Aspects examined** 
Framework combines energy hub, building simulation and distribution grid model.
Electrical grid constraints integrated by linearizing AC power flow equations.

**Summary of aspects which are interesting:** 
This paper presents a novel optimization framework that combines the optimal design and operation of distributed energy systems with calculations of electrical grid constraints and building energy use. Three new methods for integrating grid constraints were developed based on different combinations of a genetic algorithm and a mixed-integer linear programme.

Other publications assumed the grid to be exogenous and with unlimited capacity. This can lead to solutions that are not possible to integrate in the existing grids and may cause reliability and security issues.

An integrated optimization framework that incorporates the optimal design and operation of DES combined with electrical grid constraints, building simulation and interactions between various energy streams is described. It consists of building energy simulations for obtaining demand profiles, energy hub models for design and operation of building systems and a distribution grid model for power flow studies of grid stability constraints.

The MILP with linearized AC power flow method gives globally optimal solutions with possible small errors in the power flow constraints. Moreover, it efficiently solves small problems but is limited by hardware for large problems. 

he results of the test case showed that there are a large number of solutions that are optimal in terms of the distributed energy system but are not feasible from the distribution grid perspective. This shows the importance of including the electricity grid constraints in the design of distributed energy systems.


-------

**Paper name:** Optimizing Distributed Energy Resources and building retrofits with the strategic DER-CAModel

Stadler et al

**Focus / Key Aspects examined** Commonly used modeling tool


**Summary of aspects which are interesting:** 
The Distributed Energy Resources Customer Adoption Model (DER-CAM) is an optimization tool used to support DER investment decisions, typically by minimizing total annual costs or CO2 emissions while providing energy services to a given building or microgrid site. This paper shows enhancements made to DER-CAM to consider building retrofit measures along with DER investment options. Specifically, building shell improvement options have been added to DER-CAM as alternative or complementary options to investments in other DER such as PV, solar thermal, combined heat and power, or energy storage.

The DER-CAM optimization tool is a mixed-integer linear program (MILP) written and executed in the General Algebraic Modeling System (GAMS) [27]. Its objective is typically to minimize the total equivalent annual costs or CO2 emissions for providing energy services to a given site, including utility electricity and natural gas purchases, plus amortized capital and maintenance costs for any DG investments. The approach is fully technology-neutral and can include energy purchases, on-site conversion, both electrical and thermal on-site renewable harvesting, and partly end-use efficiency investments. Its optimization techniques find both the combination of equipment and its operation over a typical year (average over many historical years) that minimizes the site’s total energy bill or CO2 emissions, typically for electricity plus natural gas purchases, as well as amortized equipment purchases. It outputs the optimal DER and storage adoption combination and an hourly operating schedule, as well as the resulting costs, fuel consumption, and CO2 emissions. Given its optimization nature and technology-neutral approach, DER-CAM can capture both direct and indirect benefits of having different technologies together, for instance by reflecting the impact of CCHP in cooling loads originally met by electric chillers, thus considering the simultaneity of results.


-------

**Paper name:** Evaluating business models for microgrids: Interactions of technology and policy

Hanna et al

**Focus / Key Aspects examined** We offer a tool, based on the Distributed Energy Resources Customer Adoption Model (DER-CAM) modeling framework, that determines the cost-minimal capacity and operation of distributed energy resources in a microgrid, and apply it in southern California to three “iconic” microgrid types which represent typical commercial adopters: a large commercial building, critical infrastructure, and campus.


**Summary of aspects which are interesting:** 
First, we build internally consistent load data sets for three “iconic” types of microgrids based on real world electric and thermal loads—large systems sized for campuses or military bases; medium-sized systems for critical assets such as hospitals; and smaller systems for commercial buildings such as box stores, hotels, and office buildings.

Second, we calibrate these systems using real market and policy conditions in southern California—one of the most promising locations for microgrids—and perform several types of analysis to examine how the interplay between energy prices, technology and policy affect investment decision-making for specific technology types in microgrids—what we call the “investment case” underpinning microgrid adoption.

Through sensitivity analysis we identify four variables—the price of natural gas, cost of emitting carbon dioxide (CO2), the cost of electricity and demand in the electric tariff, and the cost of energy storage

-------

**Article name:** North American Microgrids 2015: Advancing Beyond Local Energy Optimization

Omar Saadeh - https://www.greentechmedia.com/research/report/north-american-microgrids-2015#gs.i9vX=Yg

**Focus / Key Aspects examined** The microgrid market is undergoing a transformation from a niche application intended for military bases and remote communities to a grid modernization tool for utilities, cities, communities and public institutions. This change is expected to grow the market opportunity by over 3.5 times between 2015 and 2020, to over $829 million annually.


**Summary of aspects which are interesting:** 
Mostly Campuses, Military Installations, Public Institutions but increasingly also commercial and cities/communities 


-------

**Paper name:** 

**Focus / Key Aspects examined** 


**Summary of aspects which are interesting:** 

-------

**Paper name:** 

**Focus / Key Aspects examined** 


**Summary of aspects which are interesting:** 