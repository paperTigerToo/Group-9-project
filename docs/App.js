import React, { Component } from "react";
import * as d3 from "d3";
import csvNewFile from "./shopping_behavior_updated.csv"
import Dashboard from "./Dashboard.js"
import "./App.css"

class App extends Component {

  state = {
    csvNewData: []
  };

  componentDidMount() {
    d3.csv(csvNewFile).then(data => {
      console.log("Loaded Shopping Behavior CSV:", data);
      this.setState({ csvNewData: data });
    });
  }

  render() {
    return (
      <Dashboard csvData={this.state.csvNewData} />
    )
  }

}

export default App;
