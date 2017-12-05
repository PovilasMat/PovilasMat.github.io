d3.select(window).on('load', init);

function init() {
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");	
	
d3.tsv(
  'Copenhagen_test.txt',
	function(error, data) {
    if (error) throw error;

    d3.select('body')
      .append('ul')
      .selectAll('li')
      .data(data)
      .enter()
      .append('li')
      .text(function(d){
        return d.DJF+':'+
          d.JAN;
      });
  });	
	
d3.tsv("Copenhagen_test.txt", function(error, data) {
  if (error) throw error;

  // Coerce the data to numbers.
  data.forEach(function(d) {
    d.x = +d.x;
    d.y = +d.y;
  });

  // Compute the scales’ domains.
  x.domain(d3.extent(data, function(d) { return d.DJF; })).nice();
  y.domain(d3.extent(data, function(d) { return d.JAN; })).nice();

  // Add the x-axis.
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.svg.axis().scale(x).orient("bottom"));

  // Add the y-axis.
  svg.append("g")
      .attr("class", "y axis")
      .call(d3.svg.axis().scale(y).orient("left"));

  // Add the points!
  svg.selectAll(".point")
      .data(data)
    .enter().append("circle")
      .attr("class", "point")
      .attr("r", 4.5)
      .attr("cx", function(d) { return x(d.DJF); })
      .attr("cy", function(d) { return y(d.JAN); });
});
}