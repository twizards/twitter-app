//= require d3.v3.min.js
$(document).ready(function(){
  var SIZE = 600;

  var bubble = d3.layout.pack()
    .sort(null)
    .size([SIZE, SIZE])
    .padding(1.5)
    .value(function(d) { return d.size; } );

  var svg = d3.select('#bubbles')
    .append('svg')
    .attr('width', SIZE)
    .attr('height', SIZE);

  var color = d3.scale.category10();

  updateBubbles(SIZE,bubble,svg,color);

  function updateBubbles() {
  d3.json('beverage.json', function(error, root) {
    console.log(root);
    update(root);
  });
  setTimeout(updateBubbles, 1000);
}

function update (data){

  var data = bubble.nodes(data).filter( function(d) { return !d.children; });

  var node = svg.selectAll('.node')
    .data(data, function(d)  { return d.name; });

  //ENTER
  var enter = node.enter().append('g')
    .attr('class', 'node')
    .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

  enter.append('circle')
    .attr('r', 0)
    .style('fill', function(d) { return color(d.name); })
    .style('opacity', .9);
  enter.append('text')
    .style('opacity', 0)
    .style ('fill', 'black')
    .style('text-anchor', 'middle')
    .text(function(d) { return d.name + " ("+d.value/100+"%"+")"; });

  // UPDATE
  var update = node.transition()
    .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
  
  update.select('circle')
    .attr('r', function(d) { return d.r; });

  update.select('text')
    .style('font-size', function(d) {return d.r / 3 + 'px';})
    .text(function(d) { return d.name + " ("+d.value+"%"+")"; })
    .style('opacity', 1);

  // EXIT
  var exit = node.exit()
    .transition()
    .remove()
  
  exit.select('circle').attr('r', 0);
  exit.select('text').style('opacity', 0);

}

})