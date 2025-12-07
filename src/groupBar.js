import React, { Component } from "react";
import * as d3 from "d3";

class groupBar extends Component{


    componentDidUpdate(){
    const chartData = this.props.csvData;
    console.log("Rendering chart with data: stuff");
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
        const innerWidth = width - margin.left - margin.right,
        innerHeight = height - margin.top - margin.bottom;
        const id =this.props.id;

        const svg = d3.select(`#${id}`);
    }
    render() {
        return <svg id={this.props.id} width={this.props.width} height={this.props.height}><g></g></svg>;
    } 
    

}