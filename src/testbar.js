import React, { Component } from "react";
import * as d3 from "d3";

class testbar extends Component{


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
        const bins = d3.bin()
            .domain(d3.extent(chartData, d => +d.age))
            .thresholds(d3.range(18, 70, 7))
            (chartData.map(d => +d.Age));
        function ageToRange(age) {
            const b = bins.find(bin => age >= bin.x0 && age < bin.x1);
            return b ? `${b.x0}-${b.x1-1}` : "Unknown";
        }
        
        const processedData = chartData.map(d => ({
            ...d,
            ageRange: ageToRange(+d.age)
            })).filter(d => d.ageRange !== "Unknown");
        const uniqueValues = new Set(chartData.map(d => d["Payment Method"]));
        console.log([...uniqueValues]);
        const ageLabels = [...new Set(processedData.map(d => d.ageRange))]
            .sort((a, b) => +a.split("-")[0] - +b.split("-")[0]);
        console.log(ageLabels);
       
        //const ages = new Set(chartData.map(d => d.age));
        const averageMap = new Map();

        d3.rollup(
            processedData,
            v => d3.mean(v, d => +d.trestbps),
            d => d.num,
            d => d.ageRange
            ).forEach((ageMap, num) => {
                ageMap.forEach((avg, ageRange) => {
                averageMap.set(`${num}-${ageRange}`, avg);
            });
        });

        console.log(averageMap);
         const fx = d3.scaleBand()
            .domain(numLabels)
            .rangeRound([margin.left, width - margin.right])
            .paddingInner(0.1);
        const x = d3.scaleBand()
            .domain(ageLabels)
            .rangeRound([0, fx.bandwidth()])
            .padding(0.05);

        const color = d3.scaleOrdinal()
            .domain(ageLabels)
            .range(d3.schemeSpectral[ageLabels.length])
            .unknown("#ccc");
        
        const yMax = d3.max(Array.from(averageMap.values()));
        const y = d3.scaleLinear()
            .domain([0, yMax]).nice()
            .rangeRound([height - margin.bottom, margin.top]);



        const svg = d3.select(`#${id}`)
            .attr("width", width)
            .attr("height", height);
        svg.append("g")
            .selectAll()
            .data(d3.group(processedData, d => d.num))
            .join("g")
            .attr("transform", ([num]) => `translate(${fx(num)},0)`)
            .selectAll()
            .data(([, d]) => d)
            .join("rect")
            .attr("x", d => x(d.ageRange))
            .attr("y", d => y(averageMap.get(`${d.num}-${d.ageRange}`) ?? 0))
            .attr("width", x.bandwidth())
            .attr("height", d => y(0) - y(averageMap.get(`${d.num}-${d.ageRange}`) ?? 0))
            .attr("fill", d => color(d.ageRange));
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(fx).tickSizeOuter(0))
            .call(g => g.selectAll(".domain").remove());
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(null, "s"))
            .call(g => g.selectAll(".domain").remove());
        svg.append("text")
            .attr("class", "y-axis-title")
            .attr("x", - (margin.top + innerHeight / 2))
            .attr("y", 15)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .text("Average resting blood pressure");
        svg.append("text")
            .attr("class", "x-axis-title")
            .attr("x", margin.left + innerWidth / 2)  
            .attr("y", height - 5)
            .attr("text-anchor", "middle")
            .text("heart disease severity");
        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${margin.left + 50}, ${margin.top})`);
        legend.selectAll("g")
            .data(ageLabels)
            .join("g")
            .attr("transform", (d, i) => `translate(${i * 70}, 0)`)
            .call(g => {
                // Add colored rectangle
                g.append("rect")
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", d => color(d));

                // Add text next to it
                g.append("text")
                .attr("x", 20)
                .attr("y", 12)  // roughly center vertically
                .text(d => d)
                .attr("font-size", 12)
                .attr("fill", "#000");
            });
        
    }
    render() {
        return <svg id={this.props.id} width={this.props.width} height={this.props.height}><g></g></svg>;
    } 
    

}
export default testBar;