import React from 'react'
import connect from "react-redux/es/connect/connect";
import {Spinner} from '@blueprintjs/core'
import GridLayout from 'react-grid-layout';

import EntityResultsContainer from './EntityResultsContainer'

import './Results.css'
import {sendRequest} from "../store/action";

class Results extends React.Component{
  handleCalculate = () => {
    this.props.requestModel()
  }

  render(){
    const generalInformationPiece = (key, value) => (
      <div key={key} className={'generalInformationPiece'}>
        <div className={'generalInformationKey'}>{key}</div>
        <div className={'generalInformationValue'}>{value}</div>
      </div>
    )

    const {T, S, U, K, L, M, N} = this.props.result.parameters.iterators

    const generalInformation = this.props.result
      ? [
        {key:'No. of Households', value: U},
        {key: 'Timesteps', value: S + " x " + T},
        {key: 'Gen Options', value: K+M},
        {key: 'Storage Options', value: L+N},
        {key: 'Objective Value', value: this.props.result.objective},
        {key: 'Autarky', value: computeAutarky(this.props.result) + ' %'},
        {key: 'Self Consumption', value: computeSelfConsumption(this.props.result) + ' %'}
        ]
      : []

    const generalResults = (
      <div className={'generalResults'}>
        <div className={'boxHeader'}> GENERAL </div>
        <div className={ 'generalResultsContainer'}>
        {generalInformation.map(d => generalInformationPiece(d.key, d.value))}
        </div>
      </div>
    )

    const createPropsForHousehold = (id) => ({
      entityName: "Household " + id,
      barChartProps: {
        ...createSupplyTracesByHousehold(this.props.result, id),
        demandTrace: getDemandTraceByHousehold(this.props.result.H, id),
        xAxisTitle: "Timeslices",
        yAxisTitle: "Supply by Source in KWh"
      }
    })

    const createPropsForGenInvestment = () => ({
      entityName: "Generation Investment",
      barChartProps: {
        ...createGenInvestmentTraces(this.props.result),
        xAxisTitle: "Household ID",
        yAxisTitle: "Employed Capacity by Investment Option in KW"
      }
    })

    const createPropsForStInvestment = () => ({
      entityName: "Storage Investment",
      barChartProps: {
        ...createStInvestmentTraces(this.props.result),
        xAxisTitle: "Household ID",
        yAxisTitle: "Employed Capacity by Investment Option in KW"
      }
    })

    let layout = this.props.result.H.map((household,i) => (
      {i: String(i+2), x: 0, y: i+2, w: 4, h:1, minH: 1, static: true}
    ))
    layout.push({i: String(0), x: 0, y: 0, w: 4, h:1, minH: 1, static: true})
    layout.push({i: String(1), x: 0, y: 1, w: 4, h:1, minH: 1, static: true})


    const gridOfHouseholds = (
      <GridLayout className="layout" layout={layout} cols={4} rowHeight={720} width={window.innerWidth * 0.8}>
        <div key={String(0)}>
          <EntityResultsContainer {...createPropsForGenInvestment()}/>
        </div>
        <div key={String(1)}>
          <EntityResultsContainer {...createPropsForStInvestment()}/>
        </div>
        {this.props.result.H.map((household,i) => {
          return(
            <div key={String(i+2)}>
              <EntityResultsContainer {...createPropsForHousehold(i)}/>
            </div>
          )
        })}
      </GridLayout>
    )

    return (
      <div className="results">
        <div className="banner">
          <div className="header">
            <h2>Results</h2>
            <button className="requestButton" onClick={this.handleCalculate}>CALCULATE</button>
          </div>
          </div>
          {generalResults}
          <div className="gridWrapper">
          {gridOfHouseholds}
          </div>
        <p>Copyright © 2019 Maximilian Eißler</p>
      </div>

    )
  }
}

const mapStateToProps = state => {
  return {
    result: state.result,
    requestPending: state.requestPending
  }
}

const mapDispatchToProps = dispatch => {
  return {
    requestModel: () => dispatch(sendRequest())
  }
}

const computeAutarky = (result) => {
  const totalPowerUsed = result.H.reduce((total, house, i) => (
    total + (getDemandTraceByHousehold(result.H, i).reduce((acc, t) => acc+t))
  ),0.0)
  const totalPowerImported = result.H.reduce((total, house, i) => (
    total + (getTraceByHousehold(result.fromGR, i).reduce((acc,t) => acc+t))
  ),0.0)
  return Math.round((1-(totalPowerImported + 0.001) / totalPowerUsed) * 100)
}

const computeSelfConsumption = (result) => {
  const totalPowerExported = result.H.reduce((total, house, i) => (
    total + (getTraceByHousehold(result.toGR, i).reduce((acc, t) => acc+t))
  ),0.0)
  const deviceTraces = [result.genS, result.dgenS]
  const totalPowerProduced = result.H.reduce((total, house, i) => (
    total +
    deviceTraces.map(deviceTraces => getDeviceTracesByHousehold(deviceTraces, i)).flat(2)
      .reduce((acc, t) => acc + t)
  ),0.0)

  return Math.round((1 - ((totalPowerExported + 0.001) / totalPowerProduced)) * 100)
}

const createGenInvestmentTraces = (result) => {
  const { HuGENk, HuDGENm } = result
  const { generationLinear, generationDiscrete } = result.parameters
  const deviceLists = [generationLinear, generationDiscrete]
  let traces = []
  traces = traces.concat([HuGENk, HuDGENm].map((deviceList,i) =>(
    createInvestmentTrace(deviceList, deviceLists[i])
  )).flat())
  let names = []
  names = names.concat(deviceLists.map(deviceList =>(
    getDeviceNames(deviceList)
  )).flat())
  return {
    traces: traces,
    names: names
  }
}

const createStInvestmentTraces = (result) => {
  const { HuSTk, HuDSTn } = result
  const { storageLinear, storageDiscrete } = result.parameters
  const deviceLists = [storageLinear, storageDiscrete]
  let traces = []
  traces = traces.concat([HuSTk, HuDSTn].map((deviceList,i) =>(
    createInvestmentTrace(deviceList, deviceLists[i])
  )).flat())
  let names = []
  names = names.concat(deviceLists.map(deviceList =>(
    getDeviceNames(deviceList)
  )).flat())
  return {
    traces: traces,
    names: names
  }
}

const createInvestmentTrace = (rawData, devices) => {
  if(!rawData || !devices){return []}
  return rawData.map( (device, i) => {
    const multiplier = devices[i].CAP ? devices[i].CAP : 1.0
    return multplTraceWithConst(device, multiplier)
  })
}

const createSupplyTracesByHousehold = (result, householdID) => {
  let names = []
  let traces = []
  const { fromGR, fromSC, fromTR, toGR, toSC, toTR, ncS } = result
  const { fromST, fromDST, toST, toDST, genS, dgenS } = result
  const { generationDiscrete, generationLinear, storageDiscrete, storageLinear } = result.parameters

  names = names.concat(["from Grid", "from Trade", "to Shifted Consumption", "Curtailed Load"])
  let positiveTraces = [fromGR, fromTR, toSC, ncS].map(trace => (
    getTraceByHousehold(trace, householdID)
    ))
  traces = traces.concat(positiveTraces)

  names = names.concat(["from Shifted Consumption", "to Grid", "to Trade"])
  let negativeTraces = [fromSC, toGR, toTR].map(trace => (
    negateTrace(getTraceByHousehold(trace, householdID))
  ))
  traces = traces.concat(negativeTraces)
  

  let positiveDeviceTraces = [fromST, fromDST, genS, dgenS].map(trace =>
    getDeviceTracesByHousehold(trace, householdID)
  ).flat()
  traces = traces.concat(positiveDeviceTraces)
  
  let positiveDeviceNames = [storageLinear, storageDiscrete, generationLinear, generationDiscrete]
  .map(deviceList => getDeviceNames(deviceList, "from "))
  names = names.concat(...positiveDeviceNames)


  let negativeDeviceTraces = [toST, toDST].map(trace =>
    getDeviceTracesByHousehold(trace, householdID)
  ).flat()
  traces = traces.concat(negativeDeviceTraces.map(trace=>negateTrace(trace)))
  
  
  let negativeDeviceNames = [storageLinear, storageDiscrete]
  .map(deviceList => getDeviceNames(deviceList, "to "))
  names = names.concat(...negativeDeviceNames)

  return {
    traces: traces,
    names: names
  }
}

const getTraceByHousehold = (rawData, householdId) => {
  return rawData[0].map((season,i) => {
    return rawData.map(timeslice => {
      return timeslice[i][householdId]
  })}).flat()
}

const getDeviceTracesByHousehold = (rawData, householdID) => {
  if(!rawData){return []}
  return rawData[0][0].map((device,i) => (
    rawData[i].map((season,j) => 
      rawData.map(timeslice => {
        return timeslice[j][i][householdID]
      })).flat()
  ))
}

const getDemandTraceByHousehold = (rawData,householdID) => {
  return rawData[householdID].DEM.map((season) => 
    (season.map((timeslice) => (
      timeslice.reduce((acc,val) => (acc+val))
    )
  ))).flat()
}

const negateTrace = (trace) => {
  return trace.map(d => (-d))
}

const multplTraceWithConst = (trace, constant) => (
  trace.map(d => constant*d)
)


const getDeviceNames = (deviceList, prefix = '') => {
  return deviceList.map(device =>(
    (prefix + device.name)
  ))
}


export default connect(mapStateToProps, mapDispatchToProps)(Results)