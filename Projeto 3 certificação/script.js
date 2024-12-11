const width = 1200;
const height = 600;
const padding = 100;

const svg = d3
  .select("#heatmap")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select("#tooltip");

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json").then(data => {
  const baseTemp = data.baseTemperature;
  const dataset = data.monthlyVariance;

  const xScale = d3
    .scaleBand()
    .domain(dataset.map(d => d.year))
    .range([padding, width - padding]);

  const yScale = d3
    .scaleBand()
    .domain(d3.range(0, 12))
    .range([padding, height - padding]);

  const colorScale = d3
    .scaleSequential(d3.interpolateInferno)
    .domain([
      d3.max(dataset, d => d.variance),
      d3.min(dataset, d => d.variance),
    ]);

  const xAxis = d3.axisBottom(xScale).tickValues(
    xScale.domain().filter(year => year % 10 === 0)
  );
  const yAxis = d3.axisLeft(yScale).tickFormat(month =>
    d3.timeFormat("%B")(new Date(0, month))
  );

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
    .selectAll(".cell")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.month - 1))
    .attr("width", xScale.bandwidth())
    .attr("height", yScale.bandwidth())
    .attr("fill", d => colorScale(d.variance))
    .attr("data-month", d => d.month - 1)
    .attr("data-year", d => d.year)
    .attr("data-temp", d => baseTemp + d.variance)
    .on("mouseover", (event, d) => {
      tooltip
        .style("left", `${event.pageX}px`)
        .style("top", `${event.pageY - 30}px`)
        .classed("hidden", false)
        .attr("data-year", d.year)
        .html(
          `Ano: ${d.year}<br>Mês: ${d3.timeFormat("%B")(
            new Date(0, d.month - 1)
          )}<br>Temp: ${(baseTemp + d.variance).toFixed(2)}°C<br>Variação: ${
            d.variance
          }°C`
        );
    })
    .on("mouseout", () => tooltip.classed("hidden", true));

  const legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", `translate(${padding}, ${height - padding + 40})`);

  const legendData = d3
    .range(
      d3.min(dataset, d => d.variance),
      d3.max(dataset, d => d.variance),
      (d3.max(dataset, d => d.variance) - d3.min(dataset, d => d.variance)) / 8
    );

  legend
    .selectAll("rect")
    .data(legendData)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 40)
    .attr("y", 0)
    .attr("width", 40)
    .attr("height", 20)
    .attr("fill", d => colorScale(d));

  legend
    .selectAll("text")
    .data(legendData)
    .enter()
    .append("text")
    .attr("x", (d, i) => i * 40)
    .attr("y", 35)
    .text(d => d.toFixed(1));
});
