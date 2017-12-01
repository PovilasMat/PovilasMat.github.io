d3.select(window).on('load', init);

function init() {
var margin = {top: 20, right: 20, bottom: 30, left: 30},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var now = new Date(),
    start = d3.time.year.floor(now),
    end = d3.time.year.ceil(now);

var x = d3.time.scale()
  .range([0, width])
  .domain([start, end]);

var y = d3.scale.linear()
  .range([height, 0])
  .domain([-90, 90]);

var color = d3.scale.linear()
  .domain([90, 60, 30, 0])
  .range(['#D7191C', '#FDAE61', '#ABD9E9', '#2C7BB6']);

var xAxis = d3.svg.axis()
  .scale(x)
  .orient('bottom');

var yAxis = d3.svg.axis()
  .scale(y)
  .orient('left');

var svg = d3.select('body').append('svg')
  .attr('width', width + margin.left + margin .right)
  .attr('height', height + margin.top + margin.bottom)
.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


var data = [],
    latitudes = y.ticks(90),
    days = d3.range(0, 365, 2).map(function (i) { return d3.time.day.offset(start, i); });

for (var i = 0, len = latitudes.length - 1; i < len; i++) {
  for (var j = 0, len2 = days.length - 1; j < len2; j++) {

    var day1 = days[j],
        day2 = days[j + 1],
        lat1 = latitudes[i],
        lat2 = latitudes[i + 1],
        day = new Date((day1.valueOf() + day2.valueOf()) / 2),
        lat = (lat1 + lat2) / 2;

    var solarNoon = SunCalc.getTimes(day, lat, 0).solarNoon;
    var altitude = SunCalc.getPosition(solarNoon, lat, 0).altitude * 180 / Math.PI;

    data.push({
      day1: day1,
      day2: day2,
      lat1: lat1,
      lat2: lat2,
      altitude: altitude
    });
  }
}

svg.selectAll('.cell')
  .data(data)
.enter().append('rect')
  .attr('x', function (d) { return x(d.day1); })
  .attr('y', function (d) { return y(d.lat2); })
  .attr('width', function (d) { return x(d.day2) - x(d.day1); })
  .attr('height', function (d) { return y(d.lat1) - y(d.lat2); })
  .attr('fill', function (d) { return color(d.altitude); });

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis);
}