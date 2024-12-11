d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json').then(function(data) {
    createTreemap(data);
});
function createTreemap(data) {
 
    const width = 800, height = 600;
    const svg = d3.select('#treemap')
      .attr('width', width)
      .attr('height', height);
  
    
    const color = d3.scaleOrdinal(d3.schemeCategory10);
  

    const root = d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);
  
    d3.treemap()
      .size([width, height])
      .padding(1)
      (root);
  

    svg.selectAll('.tile')
      .data(root.leaves())
      .enter().append('rect')
      .attr('class', 'tile')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', d => color(d.data.category))
      .attr('data-name', d => d.data.name)
      .attr('data-category', d => d.data.category)
      .attr('data-value', d => d.data.value)
      .on('mouseover', function(event, d) {
        const tooltip = d3.select('#tooltip');
        tooltip.style('visibility', 'visible')
          .attr('data-value', d.data.value)
          .html(`${d.data.name}<br>Categoria: ${d.data.category}<br>Valor: $${d.data.value}`);
      })
      .on('mousemove', function(event) {
        const tooltip = d3.select('#tooltip');
        tooltip.style('top', (event.pageY + 5) + 'px')
          .style('left', (event.pageX + 5) + 'px');
      })
      .on('mouseout', function() {
        d3.select('#tooltip').style('visibility', 'hidden');
      });
 
    d3.select('#title').text('Kickstarter Treemap');
    

    d3.select('#description').text('Este Treemap mostra os financiamentos de projetos no Kickstarter.');
  
  
    createLegend(data);
  }
  function createLegend(data) {
    const categories = Array.from(new Set(data.children.map(d => d.name)));
    const legend = d3.select('#legend');
  
    categories.forEach((category, index) => {
      legend.append('rect')
        .attr('class', 'legend-item')
        .attr('x', 10)
        .attr('y', index * 30)
        .attr('fill', d3.scaleOrdinal(d3.schemeCategory10)(category));
      legend.append('text')
        .attr('x', 40)
        .attr('y', index * 30 + 15)
        .text(category);
    });
  }
  