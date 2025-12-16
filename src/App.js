import React, { Component } from "react";
import * as d3 from "d3";
import csvFile from "./data.csv"
import csvNewFile from "./shopping_behavior_updated.csv"
import TestChart from "./testchart.js"
import GroupBar from './groupBar'
import TestBar from "./testbar.js"
import StackChart from "./stackchart.js"
import PieChart1 from "./pieChart.js"
import MapChart from "./map.js"
//import files that you are working on and call them in the return
// use the csvData and pass it into your files
class App extends Component {

  state = { csvData: [], 
  csvNewData: [] };

  componentDidMount() {
    d3.csv(csvFile).then(data => {
      console.log("Loaded CSV:", data);
      this.setState({ csvData: data });
    });
    d3.csv(csvNewFile).then(data => {
      console.log("Loaded 2 CSV:", data);
      this.setState({ csvNewData: data });
    });
  }
  render() {
    return (
    <>
      <h1>Hello World</h1>
      <div className="chart-container">
        <TestBar id="testchart" csvData={this.state.csvNewData} width={800} height={600} />
        <GroupBar id='groupbar' csvData={this.state.csvData} width={700} height={600}  />
        <StackChart id='stackChart' csvData={this.state.csvNewData} width={700} height={600} />
        <PieChart1 id='pieChart' csvData={this.state.csvNewData} width={700} height={600} />
        <MapChart id='mapchart' csvData={this.state.csvNewData} width={1400} height={1000} />
      </div>
    </>
    )
  }

}

export default App;
