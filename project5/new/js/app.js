//TODO: use dispatch to coordinate clicks
//https://github.com/mbostock/d3/wiki/Internals#dispatch
//http://bl.ocks.org/mbostock/5872848

(function() {
  var margin = {top: 10, left: 10, bottom: 10, right: 10},
      width = parseInt(d3.select('#map_container').style('width')),
      //width = 650,
      width = width - margin.left - margin.right,
      mapRatio = 1,
      height = width * mapRatio,
      scaleMultiplier = 300

  var mapsvg = d3.select('#map_container').append('svg')
      .attr('height', height)
      .attr('id','map')

  var colorMap = d3.map(),
      keymap = []

  var quantize = d3.scale.quantize()
      .range(d3.range(9).map(function(i) { return 'q' + i + '-9' }))

  var tiler = d3.geo.tile()
      .size([width, height])

  var projection = d3.geo.mercator()
      .center([-122.433701, 37.767683])
      .scale(width*300)
      .translate([width / 2, height / 2])

  var path = d3.geo.path()
      .projection(projection)

  mapsvg
		.call(renderTiles, 'highroad')

  function renderTiles(svg, type) {
    svg.append('g')
        .attr('class', type)
      .selectAll('g')
        .data(tiler
          .scale(projection.scale() * 2 * Math.PI)
          .translate(projection([0, 0])))
      .enter().append('g')
        .each(function(d) {
          var g = d3.select(this)
          d3.json('data/osm/' + ['a', 'b', 'c'][(d[0] * 31 + d[1]) % 3] + '-highroad-'+ d[2] + '-' + d[0] + '-' + d[1] + '.json', function(error, json) {
            g.selectAll('path')
                .data(json.features.sort(function(a, b) { return a.properties.sort_key - b.properties.sort_key }))
              .enter().append('path')
                .attr('class', function(d) { return d.properties.kind })
                .attr('d', path)
          })
        })
  }
  
    var xScale = d3.scale.linear()
        .domain([-122.533701, -122.33701])
        .range([0, width]);

    var yScale = d3.scale.linear()
        .domain([37.842683, 37.692683])
        .range([0, height]);

		
  var bump = [1, 2];
  var xx = -122.397842581798;
  var yy = 37.7686952126247;
  
  d3.json("data/sf_crime.geojson", function(error, dataset){
    if (error) throw error;
	var dot_dataX = [];
	var dot_dataY = [];
	dataset.features.forEach(function (d) {
		dot_dataX.push(xScale(d.properties.X));
		dot_dataY.push(yScale(d.properties.Y));
	})
	var dots = mapsvg.selectAll(".dots")
	for (i=0; i < dot_dataX.length; i++) { 
		dots.data(bump)
		.enter().append('circle')
		.attr('class', "dot")
		.attr('cx', dot_dataX[i])
		.attr('cy', dot_dataY[i])
		.attr('r', 1)
		.attr('fill', 'red')
	}
  })

  function resize() {
    // adjust things when the window size changes
    width = parseInt(d3.select('#map_container').style('width'));
    width = width - margin.left - margin.right;
    height = width * mapRatio;

    // update projection
    projection
        .translate([width / 2, height / 2])
        .scale(width*scaleMultiplier);

    // resize the map container
    mapsvg
        .style('width', width + 'px')
        .style('height', height + 'px');

    // resize the map
    mapsvg.select('.highroad').attr('d', path);
    mapsvg.selectAll('.minor_road').attr('d', path);
    mapsvg.selectAll('.major_road').attr('d', path);
    mapsvg.selectAll('.highway').attr('d', path);

}
}) ()
