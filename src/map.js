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

        const margin = { top: 50, right: 100, bottom: 40, left: 40 };
        const width = this.props.width;
        const height = this.props.height;
        const innerWidth = width - margin.left - margin.right,
        innerHeight = height - margin.top - margin.bottom;
        const id =this.props.id;

    }
    render() {
        return <svg id={this.props.id} width={this.props.width} height={this.props.height}><g></g></svg>;
    } 
    

}
export default MapChart;