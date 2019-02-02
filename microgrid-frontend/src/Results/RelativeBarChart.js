import React from 'react'
import Plot from 'react-plotly.js'

const RelativeBarChart = (props) => {
    const traces = props.traces.map((trace,i) => ({
        x: [...Array(trace.length).keys()],
        y: trace,
        name: props.names[i],
        type: 'bar'
    }))
    traces.push({
        x: [...Array(props.demandTrace.length).keys()],
        y: props.demandTrace,
        name: "DEMAND",
        type: 'scatter'
    })

    console.log(traces)
    return(
        <Plot
        data={traces}
        layout={
            {
                autosize: false, 
                width: window.innerWidth*0.8,
                height: 600,
                xaxis: {title: 'Timeslices'},
                yaxis: {title: 'Supply by Source in KWh'},
                barmode: 'relative'
            }
            }
      />
    )
}

export default RelativeBarChart


