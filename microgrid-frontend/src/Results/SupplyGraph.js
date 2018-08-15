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
  event as d3Event,
  easeLinear as d3EaseLinear
} from 'd3'
import './SupplyGraph.css'

class SupplyGraph extends React.Component{
  constructor(props) {
    super(props);
    this.fullHeight = document.getElementById(this.props.containerId).offsetHeight
    this.fullWidth = document.getElementById(this.props.containerId).offsetWidth
  }


  getColors(n) {
    const colors = ["#a6cee3","#1f78b4","#b2df8a","#33a02c",
      "#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6",
      "#6a3d9a"]

    return colors[n % colors.length]
  }


  setScales(width, height) {
    this.x = d3ScaleLinear()
      .domain([0,this.props.dataLength])
      .range([this.margin.left*1.5, width]);

    this.y = d3ScaleLinear()
      .domain([-5,10])
      .range([height, this.margin.bottom]);

    this.xAxis = d3AxisB(this.x)
    this.yAxis = d3AxisL(this.y)
  }

  renderAxis() {
    this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate("+ 0 +"," + (this.height) + ")")
      .call(this.xAxis).append("text")
      .attr("x",(this.margin.left + (this.width)/2) + 'px')
      .attr("y", 30 + 'px')
      .attr("fill", "#000")
      .text("Hour of Time")
      .style("font-weight", "bold")

    this.svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+ this.margin.left*1.5 + ","+ 0 +")")
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
    return (Math.floor(this.x.invert(x_pos-((window.innerWidth - this.fullWidth)/2))))
  }



  componentDidMount() {
    this.margin = {top: 20, right: 80, bottom: 50, left: 100}
    this.width = this.fullWidth - this.margin.left - this.margin.right
    this.height = this.fullHeight - this.margin.top - this.margin.bottom

    this.svg = d3Select('#graphContainer')
      .append('svg')
      .attr('width', this.fullWidth)
      .attr('height', this.fullHeight)

    this.tooltipDiv = d3Select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    this.setScales(this.width, this.height)
    this.computeAreaChart()
    this.renderAxis()
  }

  componentDidUpdate() {
    this.margin = {top: 20, right: 80, bottom: 50, left: 100}
    this.width = this.fullWidth - this.margin.left - this.margin.right
    this.height = this.fullHeight - this.margin.top - this.margin.bottom

    this.svg = d3Select('#graphContainer')
      .attr('width', this.fullWidth)
      .attr('height', this.fullHeight)

    this.setScales(this.width, this.height)
    this.computeAreaChart()
  }

  computeAreaChart() {
    const positiveData = []
    const negativeData = []

    const negativeSeries = this.props.data.filter(d => d.type === 'negative')
    const positiveSeries = this.props.data.filter(d => d.type === 'positive')

    this.nodeID = this.props.id

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

    const area = d3Area()
      .x( (d,i) => this.x(i))
      .y0( d => this.y(d[0]))
      .y1( d => this.y(d[1]))


    const z = d3InterpolateCool;

    const series = positiveStack(positiveData).concat(negativeStack(negativeData))

    this.svg.selectAll(".area").data(series).exit().remove()
    this.svg.selectAll(".area").data(series)
      .attr("class", "area")
      .on("mouseover", d => {
        this.tooltipDiv.transition()
          .duration(200)
          .style("opacity", .9);
        this.tooltipDiv.html((d.key) + "<br/>"  + Math.round(d[this.getArrayPosition(d3Event.pageX)].data[d.key]*100)/100)
          .style("left", (d3Event.pageX+ 20) + "px")
          .style("top", (d3Event.pageY - 28) + "px")
      })
      .on("mousemove", d => {
        this.tooltipDiv.html((d.key) + "<br/>"  + Math.round(d[this.getArrayPosition(d3Event.pageX)].data[d.key]*100)/100)
          .style("left", (d3Event.pageX + 20) + "px")
          .style("top", (d3Event.pageY - 28) + "px")
      })
      .on("mouseout", () => {
        this.tooltipDiv.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .transition()
      .duration(300)
      .ease(d3EaseLinear)
      .attr("d", area)
      .attr("fill", () => z(Math.random()))

    this.svg.selectAll("path")
      .data(series)
      .enter().append("path")
      .attr("class", "area")
      .on("mouseover", d => {
        this.tooltipDiv.transition()
          .duration(200)
          .style("opacity", .9);
        this.tooltipDiv.html((d.key) + "<br/>"  + Math.round(d[this.getArrayPosition(d3Event.pageX)].data[d.key]*100)/100)
          .style("left", (d3Event.pageX+ 20) + "px")
          .style("top", (d3Event.pageY - 28) + "px")
      })
      .on("mousemove", d => {
        this.tooltipDiv.html((d.key) + "<br/>"  + Math.round(d[this.getArrayPosition(d3Event.pageX)].data[d.key]*100)/100)
          .style("left", (d3Event.pageX + 20) + "px")
          .style("top", (d3Event.pageY - 28) + "px")
      })
      .on("mouseout", () => {
        this.tooltipDiv.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .transition()
      .duration(300)
      .ease(d3EaseLinear)
      .attr("d", area)
      .attr("fill", () => z(Math.random()))
  }

  render() {
    return(
      <div className={'graphContainer'} id={'graphContainer'}>
      </div>
    )
  }

}

export default SupplyGraph