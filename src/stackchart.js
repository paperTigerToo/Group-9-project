import React, { Component } from "react";
import * as d3 from "d3";

class stackchart extends Component{
    componentDidUpdate(){
    const chartData = this.props.csvData;
    console.log("Rendering chart with data: this great");
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

        const margin = { top: 50, right: 30, bottom: 40, left: 40 };
        const width = this.props.width;
        const height = this.props.height;
        const innerWidth = width - margin.left - margin.right,
        innerHeight = height - margin.top - margin.bottom;
        const id =this.props.id;


        // Determine the series that need to be stacked.
        const series = d3.stack()
            .offset(d3.stackOffsetExpand)
            .keys(d3.union(chartData.map(d => d["Payment Method"]))) // distinct series keys, in input order
            .value(([, D], key) => D.get(key)["Purchase Amount (USD)"]) // get value for each series key and stack
            (d3.index(chartData, d => d["Frequency of Purchases"], d => d["Payment Method"])); // group by stack then series key

        // Prepare the scales for positional and color encodings.
        const x = d3.scaleUtc()
            .domain(d3.extent(chartData, d => d["Frequency of Purchases"]))
            .range([marginLeft, width - marginRight]);
        const y = d3.scaleLinear()
            .rangeRound([height - marginBottom, marginTop]);

        const color = d3.scaleOrdinal()
            .domain(series.map(d => d.key))
            .range(d3.schemeTableau10);
        const area = d3.area()
            .x(d => x(d.data[0]))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]));
        
    }

    render() {
        return <svg id={this.props.id} width={this.props.width} height={this.props.height}><g></g></svg>;
    } 
}

export default stackchart;