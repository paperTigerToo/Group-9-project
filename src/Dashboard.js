import React, { Component } from "react";
import HeatMap from "./HeatMap.js";
import PieChart1 from "./pieChart.js";
import MapChart from "./map.js";
import CategoryBarChart from "./CategoryBarChart.js";
import "./Dashboard.css";

class Dashboard extends Component {
    state = {
        selectedCategory: "All",
        selectedGender: "All",
        selectedSeason: "All",
        categories: [],
        genders: [],
        seasons: [],
        currentSlide: 0
    };

    slides = [
        { id: 'pieChart', title: 'Product Category Distribution', showCategoryFilter: false },
        { id: 'categorybar', title: 'Average Spending by Product Category', showCategoryFilter: false },
        { id: 'heatmap', title: 'Payment Method vs Purchase Frequency Heatmap', showCategoryFilter: true },
        { id: 'mapchart', title: 'Geographic Distribution (US Map)', showCategoryFilter: true }
    ];

    componentDidMount() {
        this.extractFilterOptions();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.csvData !== this.props.csvData) {
            this.extractFilterOptions();
        }
    }

    extractFilterOptions = () => {
        const { csvData } = this.props;
        if (!csvData || csvData.length === 0) return;

        const categories = ["All", ...new Set(csvData.map(d => d.Category))].sort();
        const genders = ["All", ...new Set(csvData.map(d => d.Gender))].sort();
        const seasons = ["All", ...new Set(csvData.map(d => d.Season))].sort();

        this.setState({ categories, genders, seasons });
    }

    handleCategoryChange = (e) => {
        this.setState({ selectedCategory: e.target.value });
    }

    handleGenderChange = (e) => {
        this.setState({ selectedGender: e.target.value });
    }

    handleSeasonChange = (e) => {
        this.setState({ selectedSeason: e.target.value });
    }

    handleNextSlide = () => {
        this.setState(prevState => ({
            currentSlide: (prevState.currentSlide + 1) % this.slides.length,
            selectedCategory: "All",
            selectedGender: "All",
            selectedSeason: "All"
        }));
    }

    handlePrevSlide = () => {
        this.setState(prevState => ({
            currentSlide: prevState.currentSlide === 0 ? this.slides.length - 1 : prevState.currentSlide - 1,
            selectedCategory: "All",
            selectedGender: "All",
            selectedSeason: "All"
        }));
    }

    getFilteredData = () => {
        const { csvData } = this.props;
        const { selectedCategory, selectedGender, selectedSeason } = this.state;

        if (!csvData) return [];

        return csvData.filter(d => {
            const categoryMatch = selectedCategory === "All" || d.Category === selectedCategory;
            const genderMatch = selectedGender === "All" || d.Gender === selectedGender;
            const seasonMatch = selectedSeason === "All" || d.Season === selectedSeason;
            return categoryMatch && genderMatch && seasonMatch;
        });
    }

    renderCurrentChart() {
        const { currentSlide } = this.state;
        const filteredData = this.getFilteredData();
        const currentChart = this.slides[currentSlide];

        switch(currentChart.id) {
            case 'categorybar':
                return <CategoryBarChart id="categorybar" csvData={filteredData} width={900} height={400} />;
            case 'heatmap':
                return <HeatMap id="heatmap" csvData={filteredData} width={900} height={400} />;
            case 'pieChart':
                return <PieChart1 id="pieChart" csvData={filteredData} width={900} height={400} />;
            case 'mapchart':
                return <MapChart id="mapchart" csvData={filteredData} width={900} height={400} />;
            default:
                return null;
        }
    }

    render() {
        const { categories, genders, seasons, selectedCategory, selectedGender, selectedSeason, currentSlide } = this.state;
        const filteredData = this.getFilteredData();
        const dataCount = filteredData.length;
        const currentChart = this.slides[currentSlide];

        return (
            <div className="dashboard">
                <header className="dashboard-header">
                    <div className="masthead">
                        <div className="header-border-top"></div>
                        <h1 className="main-title">Shopping Behavior Analysis</h1>
                        <div className="header-border-bottom"></div>
                    </div>
                    <div className="byline">
                        <p className="authors">By Daniel Montoya, Zachary Kochev, and Daniel Jeun</p>
                        <p className="course-info">CS450-001 Data Visualization Project</p>
                    </div>
                </header>

                <div className="filter-panel">
                    <div className="filter-section">
                        <h3>Filters</h3>
                        <div className="filter-controls">
                            <div className="filter-group">
                                <label htmlFor="gender-filter">Gender:</label>
                                <select
                                    id="gender-filter"
                                    value={selectedGender}
                                    onChange={this.handleGenderChange}
                                    className="filter-select"
                                >
                                    {genders.map(gen => (
                                        <option key={gen} value={gen}>{gen}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group">
                                <label htmlFor="season-filter">Season:</label>
                                <select
                                    id="season-filter"
                                    value={selectedSeason}
                                    onChange={this.handleSeasonChange}
                                    className="filter-select"
                                >
                                    {seasons.map(season => (
                                        <option key={season} value={season}>{season}</option>
                                    ))}
                                </select>
                            </div>

                            {currentChart.showCategoryFilter && (
                                <div className="filter-group">
                                    <label htmlFor="category-filter">Category:</label>
                                    <select
                                        id="category-filter"
                                        value={selectedCategory}
                                        onChange={this.handleCategoryChange}
                                        className="filter-select"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="data-count">
                                <strong>Records:</strong> {dataCount} / {this.props.csvData.length}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="carousel-container">
                    <button className="carousel-arrow carousel-arrow-left" onClick={this.handlePrevSlide}>
                        &#8249;
                    </button>

                    <div className="chart-slide">
                        <h3 className="chart-title">{currentChart.title}</h3>
                        <div className="chart-content">
                            {this.renderCurrentChart()}
                        </div>
                        <div className="slide-indicator">
                            {currentSlide + 1} / {this.slides.length}
                        </div>
                    </div>

                    <button className="carousel-arrow carousel-arrow-right" onClick={this.handleNextSlide}>
                        &#8250;
                    </button>
                </div>
            </div>
        );
    }
}

export default Dashboard;
