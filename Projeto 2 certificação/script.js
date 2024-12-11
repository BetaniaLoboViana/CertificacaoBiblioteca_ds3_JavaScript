
const width = 800;
const height = 500;
const padding = 60;

const svg = d3
  .select("#scatterplot")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select("#tooltip");

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").then(data => {
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(data, d => d.Year) - 1, d3.max(data, d => d.Year) + 1])
    .range([padding, width - padding]);

  const yScale = d3
    .scaleTime()
    .domain([d3.min(data, d => new Date(d.Seconds * 1000)), d3.max(data, d => new Date(d.Seconds * 1000))])
    .range([padding, height - padding]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);

  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => yScale(new Date(d.Seconds * 1000)))
    .attr("r", 6)
    .attr("data-xvalue", d => d.Year)
    .attr("data-yvalue", d => new Date(d.Seconds * 1000))
    .attr("fill", d => (d.Doping ? "orange" : "green"))
    .on("mouseover", (event, d) => {
      tooltip
        .style("left", `${event.pageX}px`)
        .style("top", `${event.pageY - 30}px`)
        .classed("hidden", false)
        .attr("data-year", d.Year)
        .html(
          `${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}${
            d.Doping ? `<br><br>${d.Doping}` : ""
          }`
        );
    })
    .on("mouseout", () => tooltip.classed("hidden", true));

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height - 20)
    .attr("text-anchor", "middle")
    .text("Anos")
    .attr("class", "legend");

  svg
    .append("text")
    .attr("x", -height / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Tempo em minutos")
    .attr("class", "legend");

  const legend = svg.append("g").attr("id", "legend");

  legend
    .append("rect")
    .attr("x", width - 220)
    .attr("y", height / 2 - 40)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "green");

  legend
    .append("text")
    .attr("x", width - 190)
    .attr("y", height / 2 - 25)
    .text("Sem doping");

  legend
    .append("rect")
    .attr("x", width - 220)
    .attr("y", height / 2)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "orange");

  legend
    .append("text")
    .attr("x", width - 190)
    .attr("y", height / 2 + 15)
    .text("Com doping");
});
