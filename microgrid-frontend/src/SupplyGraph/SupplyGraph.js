import React from 'react'
import {
  scaleLinear as d3ScaleLinear,
  axisBottom as d3AxisB,
  axisLeft as d3AxisL,
  area as d3Area,
  stack as d3Stack,
  select as d3Select,
  interpolateCool as d3InterpolateCool,
  stackOrderNone,
  stackOffsetNone,
  event as d3Event
} from 'd3'
import './SupplyGraph.css'

class SupplyGraph extends React.Component{

  getColors(n) {
    const colors = ["#a6cee3","#1f78b4","#b2df8a","#33a02c",
      "#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6",
      "#6a3d9a"]

    return colors[n % colors.length]
  }


  setScales(width, height) {
    this.x = d3ScaleLinear()
      .domain([0,this.props.dataLength-1])
      .range([this.margin.left, width]);

    this.y = d3ScaleLinear()
      .domain([-2,5])
      .range([height, this.margin.bottom]);

    this.xAxis = d3AxisB(this.x)
    this.yAxis = d3AxisL(this.y)
  }

  renderAxis() {
    this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.xAxis).append("text")
      .attr("x", 350)
      .attr("y", 36)
      .attr("fill", "#000")
      .text("Hour of Time")
      .style("font-weight", "bold")

    this.svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+ (this.margin.left) + ",0)")
      .call(this.yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(this.height + this.margin.top)/2)
      .attr("y", -40)
      .attr("dy", "0.3408em")
      .attr("fill", "#000")
      .text("Supply")
      .style("font-weight", "bold")
  }

  getArrayPosition(x_pos){
    return (Math.floor(this.x.invert(x_pos)))
  }



  componentDidMount() {
    this.margin = {top: 20, right: 80, bottom: 50, left: 80}
    this.width = window.innerWidth - this.margin.left - this.margin.right
    this.height = 500 - this.margin.top - this.margin.bottom

    this.svg = d3Select('#graphContainer'+this.props.id)
      .append('svg')
      .attr('width', window.innerWidth)
      .attr('height', 500)

    this.setScales(this.width, this.height)

    const positiveData = []
    const negativeData = []

    const negativeSeries = this.props.data[0].filter(d => d.type === 'negative')
    const positiveSeries = this.props.data[0].filter(d => d.type === 'positive')

    this.nodeID = this.props.id-1

    for(let i = 0; i < this.props.dataLength; i++){
      let positiveDatum = {}
      let negativeDatum = {}

      positiveDatum.x = i
      negativeDatum.x = i

      positiveSeries.forEach(s => {
        positiveDatum[s.key] = s.value[i][this.nodeID]
      })
      positiveData.push(positiveDatum)

      negativeSeries.forEach(s => {
        negativeDatum[s.key] = -s.value[i][this.nodeID]
      })
      negativeData.push(negativeDatum)
    }

    const positiveStack = d3Stack()
      .keys(positiveSeries.map(d => d.key))
      .order(stackOrderNone)
      .offset(stackOffsetNone)

    const negativeStack = d3Stack()
      .keys(negativeSeries.map(d => d.key))
      .order(stackOrderNone)
      .offset(stackOffsetNone)

    const div = d3Select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    const area = d3Area()
      .x( (d,i) => this.x(i))
      .y0( d => this.y(d[0]))
      .y1( d => this.y(d[1]))


    const z = d3InterpolateCool;

    const series = positiveStack(positiveData).concat(negativeStack(negativeData))

    this.svg.selectAll("path")
      .data(series)
      .enter().append("path")
      .attr("d", area)
      .attr("fill", () => z(Math.random()))
      .on("mouseover", d => {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html((d.key) + "<br/>"  + Math.round(d[this.getArrayPosition(d3Event.pageX)].data[d.key]*100)/100)
          .style("left", (d3Event.pageX+ 20) + "px")
          .style("top", (d3Event.pageY - 28) + "px")
      })
      .on("mousemove", d => {
        div.html((d.key) + "<br/>"  + Math.round(d[this.getArrayPosition(d3Event.pageX)].data[d.key]*100)/100)
          .style("left", (d3Event.pageX + 20) + "px")
          .style("top", (d3Event.pageY - 28) + "px")
      })
      .on("mouseout", () => {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

    this.renderAxis()



  }
  render() {
    return(
      <div className={'graphContainer'} id={'graphContainer'+this.props.id}>
        <div className={'idContainer'}><div className={'id'}>{this.props.id}</div></div>
      </div>
    )
  }

}

export default SupplyGraph