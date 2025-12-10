import React, { Component } from "react";
import * as d3 from "d3";


class MapChart extends Component{
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

        const margin = { top: 50, right: 40, bottom: 40, left: 40 };
        const width = this.props.width;
        const height = this.props.height;
        const innerWidth = width - margin.left - margin.right,
        innerHeight = height - margin.top - margin.bottom;
        const id =this.props.id;
        const root = d3.select(`#${id}`)
            .attr("width", width)
            .attr("height", height);

            // Draw inside G with margins applied
            const svg = root.select("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        svg.selectAll("*").remove();
        d3.json("/us-states.geojson").then(geoData => {
            const projection = d3.geoAlbersUsa()
                .fitSize([innerWidth, innerHeight], geoData);

            const path = d3.geoPath().projection(projection);

            svg.selectAll("path")
                .data(geoData.features)
                .join("path")
                .attr("d", path)
                .attr("fill", "#ddd")
                .attr("stroke", "#333")
                .attr("stroke-width", 1)
                .on("mouseenter", function (event, d) {
                    const centroid = path.centroid(d);
                    d3.select(this)
                        .raise() // bring to front
                        .transition()
                        .duration(200)
                        .attr("fill", "#ffcc00")
                        .attr("stroke-width", 2)
                        .attr("transform", `translate(${centroid[0]},${centroid[1]}) scale(1.1) translate(${-centroid[0]},${-centroid[1]})`);// enlarge
                })
                .on("mouseleave", function (event, d) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr("fill", "#ddd")
                        .attr("stroke-width", 1)
                        .attr("transform", "scale(1)"); // back to normal
            });

             console.log("States:", geoData.features.length);
        });
       
    }
    render() {
        return <svg id={this.props.id} width={this.props.width} height={this.props.height}><g></g></svg>;
    } 
    

}
export default MapChart;