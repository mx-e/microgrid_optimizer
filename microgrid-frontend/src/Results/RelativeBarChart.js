import React from 'react'
import Plot from 'react-plotly.js'

const RelativeBarChart = (props) => {
    const traces = props.traces.map((trace,i) => ({
        x: [...Array(trace.length).keys()],
        y: trace,
        name: props.names[i],
        type: 'bar'
    }))
    if(props.demandTrace){
        traces.push({
            x: [...Array(props.demandTrace.length).keys()],
            y: props.demandTrace,
            name: "DEMAND",
            type: 'scatter'
        })
    }

    return(
        <Plot
        data={traces}
        layout={
            {
                autosize: false, 
                width: window.innerWidth*0.9,
                height: 600,
                xaxis: {title: props.xAxisTitle},
                yaxis: {title: props.yAxisTitle},
                barmode: 'relative'
            }
            }
      />
    )
}

export default RelativeBarChart


