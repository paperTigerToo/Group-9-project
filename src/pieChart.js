import React, { Component } from "react";
import * as d3 from "d3";

class PieChart extends Component{
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

        const margin = { top: 50, right: 100, bottom: 40, left: 40 };
        const width = this.props.width;
        const height = this.props.height;
        const innerWidth = width - margin.left - margin.right,
        innerHeight = height - margin.top - margin.bottom;
        const id =this.props.id;
        const itemCounts = d3.rollup(
            chartData,
            v => v.length,          // number of occurrences
            d => d["Item Purchased"]
        );
        const pieData = Array.from(itemCounts, ([name, value]) => ({ name, value }));
        const numofitem = [...new Set(chartData.map(d => d["Item Purchased"]))]
        const color = d3.scaleOrdinal()
            .domain(pieData.map(d => d.name))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), numofitem.length).reverse())
        

        
        // Create the pie layout and arc generator.
        const pie = d3.pie()
            .sort(null)
            .value(d => d.value);
        
        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(Math.min(width, height) / 2 - 1);
        
        const labelRadius = arc.outerRadius()() * 0.8;

        // A separate arc generator for labels.
        const arcLabel = d3.arc()
            .innerRadius(labelRadius)
            .outerRadius(labelRadius);

        const arcs = pie(pieData);

        const svg = d3.select(`#${id}`)
            .attr("width", width)
            .attr("height", height)
        const g = svg.append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);
        // Add a sector path for each value.
        g.append("g")
            .attr("stroke", "white")
            .selectAll()
            .data(arcs)
            .join("path")
            .attr("fill", d => color(d.data.name))
            .attr("d", arc)
            .append("title")
            .text(d => `${d.data.name}: ${d.data.value}`);

        // Create a new arc generator to place a label close to the edge.
        // The label shows the value if there is enough room.
        g.append("g")
            .attr("text-anchor", "middle")
            .selectAll()
            .data(arcs)
            .join("text")
            .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
            .call(text => text.append("tspan")
                .attr("y", "-0.4em")
                .attr("font-weight", "bold")
                .text(d => d.data.name))
            .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
                .attr("x", 0)
                .attr("y", "0.7em")
                .attr("fill-opacity", 0.7)
                .attr("font-size", 10)
                .text(d => d.data.value.toLocaleString("en-US")));
    }
    render() {
        return <svg id={this.props.id} width={this.props.width} height={this.props.height}><g></g></svg>;
    } 
    

}
export default PieChart;