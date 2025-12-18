import React, { Component } from "react";
import * as d3 from "d3";

class HeatMap extends Component {
    componentDidUpdate() {
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

        const margin = { top: 20, right: 20, bottom: 80, left: 120 };
        const width = this.props.width;
        const height = this.props.height;
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        const id = this.props.id;

        d3.select(`#${id}`).selectAll("*").remove();

        const grouped = d3.rollup(
            chartData,
            v => v.length,
            d => d["Frequency of Purchases"],
            d => d["Payment Method"]
        );

        const frequencies = Array.from(new Set(chartData.map(d => d["Frequency of Purchases"]))).sort();
        const paymentMethods = Array.from(new Set(chartData.map(d => d["Payment Method"]))).sort();

        const heatmapData = [];
        frequencies.forEach(freq => {
            paymentMethods.forEach(payment => {
                const count = grouped.get(freq)?.get(payment) || 0;
                heatmapData.push({
                    frequency: freq,
                    payment: payment,
                    count: count
                });
            });
        });

        const xScale = d3.scaleBand()
            .domain(frequencies)
            .range([0, innerWidth])
            .padding(0.05);

        const yScale = d3.scaleBand()
            .domain(paymentMethods)
            .range([0, innerHeight])
            .padding(0.05);

        const colorScale = d3.scaleSequential()
            .domain([0, d3.max(heatmapData, d => d.count)])
            .interpolator(d3.interpolateReds);

        const tooltip = d3.select("body").append("div")
            .attr("class", "heatmap-tooltip")
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
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        g.selectAll("rect")
            .data(heatmapData)
            .join("rect")
            .attr("x", d => xScale(d.frequency))
            .attr("y", d => yScale(d.payment))
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .attr("fill", d => d.count === 0 ? "#f0f0f0" : colorScale(d.count))
            .attr("stroke", "#fff")
            .attr("stroke-width", 2)
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .attr("stroke", "#000")
                    .attr("stroke-width", 3);

                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);

                tooltip.html(`
                    <strong>Frequency:</strong> ${d.frequency}<br/>
                    <strong>Payment Method:</strong> ${d.payment}<br/>
                    <strong>Count:</strong> ${d.count} purchases
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
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 2);

                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        g.selectAll("text.cell-label")
            .data(heatmapData)
            .join("text")
            .attr("class", "cell-label")
            .attr("x", d => xScale(d.frequency) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d.payment) + yScale.bandwidth() / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("fill", d => d.count > d3.max(heatmapData, d => d.count) / 2 ? "#fff" : "#000")
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .style("pointer-events", "none")
            .text(d => d.count);

        g.append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .attr("dx", "-0.5em")
            .attr("dy", "0.5em");

        g.append("g")
            .call(d3.axisLeft(yScale));

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height - 10)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .text("Frequency of Purchases");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .text("Payment Method");
    }

    render() {
        return <svg id={this.props.id} width={this.props.width} height={this.props.height}></svg>;
    }
}

export default HeatMap;
