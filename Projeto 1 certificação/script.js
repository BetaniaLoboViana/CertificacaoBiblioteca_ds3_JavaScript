// script.js
const width = 800;
const height = 400;
const margin = { top: 20, right: 30, bottom: 50, left: 60 };

// Criação do SVG
const svg = d3.select("#chart-container")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", `translate(${margin.left},${margin.top})`);

// Carregar dados
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
  .then(data => {
    const dataset = data.data;

    // Escalas
    const xScale = d3.scaleTime()
                     .domain([new Date(d3.min(dataset, d => d[0])), new Date(d3.max(dataset, d => d[0]))])
                     .range([0, width]);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(dataset, d => d[1])])
                     .range([height, 0]);

    // Eixos
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
       .attr("id", "x-axis")
       .attr("transform", `translate(0,${height})`)
       .call(xAxis);

    svg.append("g")
       .attr("id", "y-axis")
       .call(yAxis);

    // Barras
    svg.selectAll(".bar")
       .data(dataset)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("x", d => xScale(new Date(d[0])))
       .attr("y", d => yScale(d[1]))
       .attr("width", width / dataset.length - 1)
       .attr("height", d => height - yScale(d[1]))
       .attr("data-date", d => d[0])
       .attr("data-gdp", d => d[1])
       .on("mouseover", (event, d) => {
         const tooltip = d3.select("#tooltip");
         tooltip.style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 50}px`)
                .style("display", "block")
                .attr("data-date", d[0])
                .html(`Date: ${d[0]}<br>GDP: ${d[1]}`);
       })
       .on("mouseout", () => {
         d3.select("#tooltip").style("display", "none");
       });
  });
