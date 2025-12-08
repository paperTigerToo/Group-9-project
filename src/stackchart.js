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

        const grouped = d3.rollup(
            chartData,
            v => d3.sum(v, d => +d["Purchase Amount (USD)"]),
            d => d["Frequency of Purchases"],
            d => d["Payment Method"]
            );
        // Determine the series that need to be stacked.
        const paymentKeys = d3.union(chartData.map(d => d["Payment Method"]));

        const series = d3.stack()
            .offset(d3.stackOffsetExpand)
            .keys(paymentKeys)
            .value(([, D], key) => D.get(key) ?? 0)
            (grouped);
        // Prepare the scales for positional and color encodings.
        const frequencies = [...grouped.keys()];

        const x = d3.scaleBand()
            .domain(frequencies)
            .range([margin.left, width - margin.right])
            .padding(0);
        const y = d3.scaleLinear()
            .domain([0,1])
            .rangeRound([height - margin.bottom, margin.top]);

        const color = d3.scaleOrdinal()
            .domain(series.map(d => d.key))
            .range(d3.schemeTableau10);
        const area = d3.area()
            .x(d => x(d.data[0]) + x.bandwidth() / 2)
            .y0(d => y(d[0]))
            .y1(d => y(d[1]));
        

        const svg = d3.select(`#${id}`)
            .attr("width", width)
            .attr("height", height)

        // Append a path for each series.
        svg.append("g")
            .selectAll()
            .data(series)
            .join("path")
            .attr("fill", d => color(d.key))
            .attr("d", area)
            .append("title")
            .text(d => d.key);

        // Append the x axis, and remove the domain line.
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .call(g => g.select(".domain").remove());

        // Add the y axis, remove the domain line, add grid lines and a label.
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(height / 80, "%"))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line")
                .filter(d => d === 0 || d === 1)
                .clone()
                .attr("x2", width - margin.left - margin.right))
            .call(g => g.append("text")
                .attr("x", -margin.left)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("↑ Unemployed persons"));
            
        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width - margin.right -50}, ${margin.top})`);
        legend.selectAll("g")
            .data(paymentKeys)
            .join("g")
            .attr("transform", (d, i) => `translate(0,${i * 20})`)
            .call(g => {
                // Add colored rectangle
                g.append("rect")
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", d => color(d));

                // Add text next to it
                g.append("text")
                .attr("x", 20)
                .attr("y", 12)  // roughly center vertically
                .text(d => d)
                .attr("font-size", 12)
                .attr("fill", "#000");
            });
    }

    render() {
        return <svg id={this.props.id} width={this.props.width} height={this.props.height}><g></g></svg>;
    } 
}

export default stackchart;