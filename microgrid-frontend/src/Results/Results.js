import React from 'react'
import connect from "react-redux/es/connect/connect";
import {Spinner} from '@blueprintjs/core'
import GridLayout from 'react-grid-layout';

import EntityResultsContainer from './EntityResultsContainer'

import './Results.css'

class Results extends React.Component{


  render(){
    const generalInformationPiece = (key, value) => (
      <div key={key} className={'generalInformationPiece'}>
        <div className={'generalInformationKey'}>{key}</div>
        <div className={'generalInformationValue'}>{value}</div>
      </div>
    )

    const generalInformation = this.props.result
      ? [{key:'No. of Households', value: this.props.result.N},
        {key: 'Timesteps', value: this.props.result.T},
        {key: 'Objective Value', value: this.props.result.Objective}]
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
      demandTrace: getDemandTraceByHousehold(this.props.result.H, id)
      }
    })

    const layout = this.props.result.H.map((household,i) => (
      {i: String(i), x: 0, y: i, w: 1, h:4, minH: 4, static: true}
    ))

    const gridOfHouseholds = (
      <GridLayout className="layout" layout={layout} cols={12} rowHeight={170} width={1200}>
        {this.props.result.H.map((household,i) => {
          return(
            <div key={String(i)}>
              <EntityResultsContainer {...createPropsForHousehold(i)}/>
            </div>
          )
        })}
      </GridLayout>
    )
    


    return (
      <div className="Results">
        <div className="banner">
          <div className="Header">
            <h2>Results</h2>
          </div>
          </div>
          {generalResults}
          {gridOfHouseholds}
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
      timeslice.reduce((acc,val) => acc+val)
  )
  ))).flat()
}

const negateTrace = (trace) => {
  return trace.map(d => (-d))
}

const getDeviceNames = (deviceList, prefix) => {
  return deviceList.map(device =>(
    (prefix + device.name)
  ))
}


export default connect(mapStateToProps)(Results)