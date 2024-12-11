const svg = d3.select("svg");
const tooltip = d3.select("#tooltip");
const path = d3.geoPath();

const educationData = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const countyData = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

Promise.all([d3.json(educationData), d3.json(countyData)]).then(data => {
    const edu = data[0];
    const counties = topojson.feature(data[1], data[1].objects.counties).features;

    const color = d3.scaleThreshold()
        .domain(d3.range(2, 8))
        .range(d3.schemeBlues[7]);

    svg.append("g")
        .selectAll("path")
        .data(counties)
        .enter().append("path")
        .attr("class", "county")
        .attr("d", path)
        .attr("fill", d => {
            const result = edu.find(obj => obj.fips === d.id);
            return result ? color(result.bachelorsOrHigher) : "#ccc";
        })
        .attr("data-fips", d => d.id)
        .attr("data-education", d => {
            const result = edu.find(obj => obj.fips === d.id);
            return result ? result.bachelorsOrHigher : 0;
        })
        .on("mouseover", (event, d) => {
            const result = edu.find(obj => obj.fips === d.id);
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(result ? result.area_name + ", " + result.state + ": " + result.bachelorsOrHigher + "%" : "No data")
                .attr("data-education", result ? result.bachelorsOrHigher : 0)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", d => tooltip.transition().duration(500).style("opacity", 0));

    const x = d3.scaleLinear()
        .domain([2, 8])
        .rangeRound([600, 860]);

    const legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", "translate(0,40)");

    legend.selectAll("rect")
        .data(color.range().map(d => color.invertExtent(d)))
        .enter().append("rect")
        .attr("height", 8)
        .attr("x", d => x(d[0]))
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("fill", d => color(d[0]));

    legend.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0])
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Percentual com diploma superior");

    legend.call(d3.axisBottom(x)
        .tickSize(13)
        .tickFormat((x, i) => i ? x : x + "%")
        .tickValues(color.domain()))
        .select(".domain")
        .remove();
});
