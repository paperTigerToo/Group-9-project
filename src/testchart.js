import React, { Component } from "react";
import * as d3 from "d3";

class testchart extends Component {
    componentDidUpdate(){
    const chartData = this.props.csvData;
    console.log("Rendering chart with data:", chartData);
    // Don't render if data is empty
    if (!chartData || chartData.length === 0) {
        return;
    }
}
render() {
    return <svg width={400} height={300}></svg>;
  }
}

export default testchart;