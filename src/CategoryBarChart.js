import React, { Component } from "react";
import * as d3 from "d3";

class CategoryBarChart extends Component {

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

        const margin = { top: 60, right: 120, bottom: 60, left: 120 };
        const width = this.props.width;
        const height = this.props.height;
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        const id = this.props.id;

        d3.select(`#${id}`).selectAll("*").remove();

        const categoryData = d3.rollup(
            chartData,
            v => ({
                avgPurchase: d3.mean(v, d => +d["Purchase Amount (USD)"]),
                count: v.length
            }),
            d => d.Category
        );

        const dataArray = Array.from(categoryData, ([category, values]) => ({
            category,
            avgPurchase: values.avgPurchase,
            count: values.count
        })).sort((a, b) => b.avgPurchase - a.avgPurchase);

        const yScale = d3.scaleBand()
            .domain(dataArray.map(d => d.category))
            .range([0, innerHeight])
            .padding(0.2);

        const xScale = d3.scaleLinear()
            .domain([0, d3.max(dataArray, d => d.avgPurchase)])
            .range([0, innerWidth])
            .nice();

        const colorScale = d3.scaleOrdinal()
            .domain(dataArray.map(d => d.category))
            .range(d3.schemeTableau10);

        const svg = d3.select(`#${id}`)
            .attr("width", width)
            .attr("height", height);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        svg.append("text")
            .attr("class", "chart-title")
            .attr("x", width / 2)
            .attr("y", 25)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Average Purchase Amount by Category");

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("padding", "10px")
            .style("background", "rgba(0, 0, 0, 0.8)")
            .style("color", "#fff")
            .style("border-radius", "4px")
            .style("pointer-events", "none")
            .style("opacity", 0)
            .style("font-size", "12px");

        g.selectAll("rect")
            .data(dataArray)
            .join("rect")
            .attr("y", d => yScale(d.category))
            .attr("x", 0)
            .attr("height", yScale.bandwidth())
            .attr("width", d => xScale(d.avgPurchase))
            .attr("fill", d => colorScale(d.category))
            .attr("opacity", 0.85)
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .attr("opacity", 1)
                    .attr("stroke-width", 2)
                    .attr("stroke", "#333");

                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);

                tooltip.html(`
                    <strong>${d.category}</strong><br/>
                    <strong>Avg Purchase:</strong> $${d.avgPurchase.toFixed(2)}<br/>
                    <strong>Total Items:</strong> ${d.count}
                `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                d3.select(this)
                    .attr("opacity", 0.85)
                    .attr("stroke-width", 1)
                    .attr("stroke", "#fff");

                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        g.selectAll(".bar-label")
            .data(dataArray)
            .join("text")
            .attr("class", "bar-label")
            .attr("x", d => xScale(d.avgPurchase) + 5)
            .attr("y", d => yScale(d.category) + yScale.bandwidth() / 2)
            .attr("dy", "0.35em")
            .style("font-size", "12px")
            .style("font-weight", "600")
            .attr("fill", "#333")
            .text(d => `$${d.avgPurchase.toFixed(2)}`);

        g.append("g")
            .call(d3.axisLeft(yScale))
            .selectAll("text")
            .style("font-size", "12px");

        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale).ticks(5).tickFormat(d => `$${d}`))
            .selectAll("text")
            .style("font-size", "11px");

        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", margin.left + innerWidth / 2)
            .attr("y", height - 20)
            .attr("text-anchor", "middle")
            .style("font-size", "13px")
            .style("font-weight", "600")
            .attr("fill", "#333")
            .text("Average Purchase Amount (USD)");

        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -(margin.top + innerHeight / 2))
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .style("font-size", "13px")
            .style("font-weight", "600")
            .attr("fill", "#333")
            .text("Product Category");
    }

    render() {
        return <svg id={this.props.id} width={this.props.width} height={this.props.height}></svg>;
    }
}

export default CategoryBarChart;
