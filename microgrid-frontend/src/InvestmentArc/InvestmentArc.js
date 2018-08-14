import React from 'react'
import Chart from 'chart.js'
import './InvestmentArc.css'

class InvestmentArc extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.buildDataObject(props)
  }

  buildDataObject (props) {
    const generationInvestment = {key: 'Generation', value: props.data.filter(d => d.type === 'generation')}
    const storageInvestment = {key: 'Storage', value: props.data.filter(d => d.type === 'storage')}
    const otherInvestment = {key: 'Other', value: props.data.filter(d => d.type === 'other')}

    this.arcSets = [generationInvestment, storageInvestment, otherInvestment]
  }

  renderArcs () {
    this.charts = []
    this.arcSets.forEach(set => {
      const cfx = 'arcChart' + this.props.id + set.key
      const data = {
        datasets: [
          {
            label: set.key,
            data: set.value.map(d => d.value[this.props.id])
          }
        ],
        labels: set.value.map(d => d.key)
      }
      const chart = new Chart(cfx, {
        type: 'doughnut',
        data: data,
        options: {
          title: {
            display: true,
            text: set.key
          }
        }
      })
      this.charts.push(chart)
    })
  }

  updateData() {
    this.arcSets.forEach((set, i) => {
      const data = {
        data: set.value.map(d => d.value[this.props.id]),
        labels: set.value.map(d => d.key)
      }
      this.charts[i].data.labels = data.labels
      this.charts[i].data.datasets.forEach((dataset) => {
        dataset.data = data.data
      })
      this.charts[i].update();
      })
  }

  componentDidMount() {
    this.renderArcs()
  }

  componentDidUpdate() {
    this.buildDataObject(this.props)
    this.updateData()
  }

  render() {
    const padding = 40
    const chartsHeight = document.getElementById(this.props.containerId).offsetHeight
    const chartsWidth = document.getElementById(this.props.containerId).offsetWidth / 3

    return (
      <div className={'arcContainer'} id={'arcContainer'+this.props.id} style={{width: chartsWidth*3, height: chartsHeight}}>
        {this.arcSets.map(set =>
        <div key={set.key} className={'canvasContainer'} style={{width: chartsWidth-padding, height: chartsHeight-padding, marginLeft: 0, marginRight: 0}}>
          <canvas id={'arcChart' + this.props.id + set.key} width={chartsWidth-padding} height={chartsHeight-padding}></canvas>
        </div>
        )}
      </div>
    )
  }
}

export default InvestmentArc