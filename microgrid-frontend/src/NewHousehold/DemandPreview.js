import React from 'react'
import './DemandPreview.css'
import Chart from 'chart.js'

class DemandPreview extends React.Component{

  renderChart(){
     this.chart = new Chart(('chart' + this.props.title), {
      type: 'line',
      data: {
        datasets: [{
          label: 'Energy Consumption ' + this.props.title,
          data: this.props.data,
          fill: 'origin',
          backgroundColor: this.props.theme,
          showLine: true
        }],
        labels: this.props.data.map((d,i) => (i + ':00 h'))
      },
      options: {
        scales:{
          yAxes: [{
            ticks: {
              min: 0
            },
          }],
        }
      }

    })
  }

  updateChart(){
    if(this.props.data.length > 0){
      this.chart.data = {
        datasets: [
          Object.assign({}, this.chart.data.datasets[0],{
            data: this.props.data
          })
        ],
        labels: this.chart.data.labels
      }
      this.chart.update()
    }
  }

  componentDidMount(){
    this.renderChart()
  }

  componentDidUpdate(){
    this.updateChart()
  }

  render(){
    return(
      <div>
        <canvas id={'chart' + this.props.title} height={130} width={250}></canvas>
      </div>
    )
  }
}

export default DemandPreview