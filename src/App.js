import React, { Component } from "react";
import * as d3 from "d3";
import csvFile from "./data.csv"
import TestChart from "./testchart.js"
import GroupBar from './groupBar'
//import files that you are working on and call them in the return
// use the csvData and pass it into your files
class App extends Component {

  state = { csvData: [] };

  componentDidMount() {
    d3.csv(csvFile).then(data => {
      console.log("Loaded CSV:", data);
      this.setState({ csvData: data });
    });
  }
  render() {
    return (
    <>
      <h1>Hello World</h1>
      <div className="chart-container">
        <TestChart id="testchart" csvData={this.state.csvData} width={600} height={400} />
        <GroupBar id='groupbar' csvData={this.state.csvData} width={700} height={600}  />
      </div>
    </>
    )
  }

}

export default App;
