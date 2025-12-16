import React, { Component } from "react";
import * as d3 from "d3";

class MapChart extends Component{
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

        const margin = { top: 10, right: 10, bottom: 10, left: 10 };
        const width = this.props.width;
        const height = this.props.height;
        const innerWidth = width - margin.left - margin.right,
        innerHeight = height - margin.top - margin.bottom;
        const id =this.props.id;
        const root = d3.select(`#${id}`)
            .attr("width", width)
            .attr("height", height);

        const svg = root.select("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        svg.selectAll("*").remove();

        const stateData = d3.rollup(
            chartData,
            v => ({
                count: v.length,
                avgPurchase: d3.mean(v, d => +d["Purchase Amount (USD)"]),
                totalRevenue: d3.sum(v, d => +d["Purchase Amount (USD)"])
            }),
            d => d.Location
        );

        const tooltip = d3.select("body").append("div")
            .attr("class", "map-tooltip")
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
        d3.json("/us-states-with-ak-hi.geojson").then(geoData => {
            const projection = d3.geoAlbersUsa()
                .fitSize([innerWidth, innerHeight], geoData);

            const path = d3.geoPath().projection(projection);

            const zoom = d3.zoom()
                .scaleExtent([1, 4])
                .translateExtent([[0, 0], [width, height]])
                .extent([[0, 0], [width, height]])
                .on("zoom", (event) => {
                    svg.attr("transform", `translate(${margin.left}, ${margin.top}) ${event.transform}`);
                });

            root.call(zoom);

            root.append("text")
                .attr("x", width - 80)
                .attr("y", 20)
                .attr("cursor", "pointer")
                .attr("fill", "#000")
                .attr("font-size", "12px")
                .attr("font-weight", "bold")
                .text("Reset Zoom")
                .on("click", () => {
                    root.transition()
                        .duration(750)
                        .call(zoom.transform, d3.zoomIdentity);
                });

            svg.selectAll("path")
                .data(geoData.features)
                .join("path")
                .attr("d", path)
                .attr("fill", d => {
                    const stateName = d.properties.name;
                    return stateData.has(stateName) ? "#69b3a2" : "#ddd";
                })
                .attr("stroke", "#333")
                .attr("stroke-width", 1)
                .on("mouseenter", function (event, d) {
                    const centroid = path.centroid(d);
                    const stateName = d.properties.name;
                    const data = stateData.get(stateName);

                    d3.select(this)
                        .raise()
                        .transition()
                        .duration(200)
                        .attr("fill", data ? "#ff9500" : "#ffcc00")
                        .attr("stroke-width", 2)
                        .attr("transform", `translate(${centroid[0]},${centroid[1]}) scale(1.1) translate(${-centroid[0]},${-centroid[1]})`);

                    tooltip.transition()
                        .duration(200)
                        .style("opacity", 1);

                    if (data) {
                        tooltip.html(`
                            <strong>${stateName}</strong><br/>
                            <strong>Total Purchases:</strong> ${data.count}<br/>
                            <strong>Avg Purchase:</strong> $${data.avgPurchase.toFixed(2)}<br/>
                            <strong>Total Revenue:</strong> $${data.totalRevenue.toFixed(2)}
                        `)
                            .style("left", (event.pageX + 15) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    } else {
                        tooltip.html(`
                            <strong>${stateName}</strong><br/>
                            <em>No purchase data</em>
                        `)
                            .style("left", (event.pageX + 15) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    }
                })
                .on("mousemove", function (event) {
                    tooltip
                        .style("left", (event.pageX + 15) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseleave", function (event, d) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("fill", () => {
                            const stateName = d.properties.name;
                            return stateData.has(stateName) ? "#69b3a2" : "#ddd";
                        })
                        .attr("stroke-width", 1)
                        .attr("transform", "scale(1)");

                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
            });
        });
    }
    render() {
        return <svg id={this.props.id} width={this.props.width} height={this.props.height}><g></g></svg>;
    }
}
export default MapChart;
