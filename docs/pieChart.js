import React, { Component } from "react";
import * as d3 from "d3";

class PieChart extends Component{
    componentDidUpdate(){
    const chartData = this.props.csvData;
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

        d3.select(`#${id}`).selectAll("*").remove();

        const itemCounts = d3.rollup(
            chartData,
            v => v.length,
            d => d.Category
        );
        const pieData = Array.from(itemCounts, ([name, value]) => ({ name, value }));
        const categories = [...new Set(chartData.map(d => d.Category))];
        const color = d3.scaleOrdinal()
            .domain(pieData.map(d => d.name))
            .range(d3.schemeTableau10)

        const pie = d3.pie()
            .sort(null)
            .value(d => d.value);

        const radius = Math.min(width, height) / 2 - 60;

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        const labelRadius = radius * 0.75;

        const arcLabel = d3.arc()
            .innerRadius(labelRadius)
            .outerRadius(labelRadius);

        const arcs = pie(pieData);

        const tooltip = d3.select("body").append("div")
            .attr("class", "pie-tooltip")
            .style("position", "absolute")
            .style("padding", "10px")
            .style("background", "rgba(0, 0, 0, 0.85)")
            .style("color", "#fff")
            .style("border-radius", "6px")
            .style("pointer-events", "none")
            .style("opacity", 0)
            .style("font-size", "13px")
            .style("box-shadow", "0 4px 6px rgba(0,0,0,0.3)")
            .style("z-index", "1000");

        const svg = d3.select(`#${id}`)
            .attr("width", width)
            .attr("height", height);

        const g = svg.append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const total = d3.sum(pieData, d => d.value);

        g.append("g")
            .attr("stroke", "white")
            .selectAll()
            .data(arcs)
            .join("path")
            .attr("fill", d => color(d.data.name))
            .attr("d", arc)
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("opacity", 0.8)
                    .attr("transform", "scale(1.05)");

                const percentage = ((d.data.value / total) * 100).toFixed(1);
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);

                tooltip.html(`
                    <strong>${d.data.name}</strong><br/>
                    <strong>Count:</strong> ${d.data.value} items<br/>
                    <strong>Percentage:</strong> ${percentage}%
                `)
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mousemove", function(event) {
                tooltip
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("opacity", 1)
                    .attr("transform", "scale(1)");

                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        g.append("g")
            .attr("text-anchor", "middle")
            .selectAll()
            .data(arcs)
            .join("text")
            .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
            .style("pointer-events", "none")
            .each(function(d) {
                const percentage = ((d.data.value / total) * 100).toFixed(1);
                if ((d.endAngle - d.startAngle) > 0.15) {
                    d3.select(this)
                        .append("tspan")
                        .attr("y", "0em")
                        .attr("font-weight", "bold")
                        .attr("font-size", "13px")
                        .attr("fill", "#fff")
                        .attr("stroke", "#000")
                        .attr("stroke-width", "0.5px")
                        .attr("paint-order", "stroke")
                        .text(`${percentage}%`);
                }
            });

        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${width - 140}, 20)`);

        const legendItems = legend.selectAll("g")
            .data(pieData)
            .join("g")
            .attr("transform", (d, i) => `translate(0, ${i * 22})`);

        legendItems.append("rect")
            .attr("width", 16)
            .attr("height", 16)
            .attr("fill", d => color(d.name))
            .attr("stroke", "#333")
            .attr("stroke-width", 1);

        legendItems.append("text")
            .attr("x", 22)
            .attr("y", 13)
            .attr("font-size", "11px")
            .attr("font-family", "'Times New Roman', Times, serif")
            .text(d => d.name);
    }
    render() {
        return <svg id={this.props.id} width={this.props.width} height={this.props.height}><g></g></svg>;
    }
}
export default PieChart;
