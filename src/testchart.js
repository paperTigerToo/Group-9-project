import React, { Component } from "react";
import * as d3 from "d3";

class testchart extends Component {
    componentDidUpdate(){
    const chartData = this.props.csvData;
    console.log("Rendering chart with data:", chartData);
    // Don't render if data is empty
    if (!chartData || chartData.length === 0) {
        return;
    }
    this.renderChart();
    }
    componentDidMount() {
        this.renderChart();
    }
    renderChart = () => {
        const chartData = this.props.csvData;
        if (!chartData || chartData.length === 0) return;
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const width = this.props.width;
        const height = this.props.height;
        const id =this.props.id;
      const innerWidth = width - margin.left - margin.right,
      innerHeight = height - margin.top - margin.bottom;
    console.log(
        chartData.slice(0, 10).map(d => ({
            age: +d.age,
            thalch: +d.thalch,
            sex: +d.sex
        }))
        );
    const svg = d3.select(`#${id}`);
    svg.selectAll("*").remove();
    svg.attr("transform", `translate(${margin.left},${margin.top})`);
    const xScale = d3.scaleLinear().domain([0,d3.max(chartData, d => +d.age)]).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain([0, d3.max(chartData, d => +d.thalch)]).range([innerHeight, 0]);
    const xaxis = d3.axisBottom(xScale);
    const yaxis = d3.axisLeft(yScale);
    svg.append("g")
       .attr("transform", `translate(0, ${innerHeight})`)
       .call(xaxis);

    svg.append("g")
       .call(yaxis);

    svg.selectAll("circle")
       .data(chartData)
       .join("circle")
       .attr("cx", d => xScale(+d.age))
       .attr("cy", d => yScale(+d.thalch))
       .attr("r", 5)
       .attr("fill", d => d.sex === "Male" ? "blue" : "pink");
    console.log(d3.max(chartData,d=> +d.age));
    }
    
render() {
    return <svg id={this.props.id} width={this.props.width} height={this.props.height}><g></g></svg>;
  }
}

export default testchart;