import React from 'react'

class InvestmentArc extends React.Component {
  componentDidMount() {
    console.log(this.props.data)


  }





  render() {

    const cfx = document.getElementById('arcChart' + this.props.id)

    const data = {
      datasets: [{
        data: [10,20,30]
      }],
      labels: [
        'vmskf',
        'cnneun',
        'denne'
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ]
    }



    return(
      <div className={'arcContainer'} id={'arcContainer'+this.props.id}>
        <canvas id={'arcChart' + this.props.id} width="400" height="400"></canvas>
        <div className={'idContainer'}><div className={'id'}>{this.props.id}</div></div>
      </div>
    )
  }
}

export default InvestmentArc