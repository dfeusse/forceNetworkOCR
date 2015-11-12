console.log('called visual.js')

var margin = {top: 30, right: 30, bottom: 30, left: 50},
	width = 800 - margin.right,
	height = 600 - margin.top - margin.bottom;

var virusCenters = {
    "mostLoved": {x: width/3, y: height/3},
	"mostAnticipated": {x: width/2, y: height/3},
	"mostWatched": {x: width/1.5, y: height/3},
	"notAirtime": {x: width/2.5, y: height/1.5},
	"remaining": {x: width/1.5, y: height/1.5},
	"na": {x: 0, y: 0}
};

var nodeCenter = {x: width/2, y: height/2};

var svg = d3.select('#visual').append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var nodes = [],
	damper = 0.1;

d3.json('../virus.json', function(data) {
	console.log(data);

	data.forEach(function(d) {
		node = {
			virus: d.virus,
			x: Math.random() * 900,
			y: Math.random() * 800
		};
		nodes.push(node);
	}); // end of data.forEach()

	var circles = svg.selectAll('.nodes')
		.data(nodes)
		.enter()
		.append('g')
		.attr('class', 'nodes');

	/*
	circles.append('circle')
		.attr('class', 'mynodes')
		.attr('r', 10)
		.attr('fill', 'steelblue')
	*/
	circles.append("svg:image")
	    .attr("class", "circle")
	    .attr("xlink:href", "https://github.com/favicon.ico")
	    .attr("x", "-8px")
	    .attr("y", "-8px")
	    .attr("width", "16px")
	    .attr("height", "16px");

	function charge(d) {
		return -20;
	}

	var force = d3.layout.force()
		.nodes(nodes)
		.size([width, height]);

	circles.call(force.drag);

	force.gravity(-0.01)
		.charge(charge)
		.friction(0.95)
		.on('tick', function(e) {
			force.nodes().forEach(function(d) {
				var target = nodeCenter
					d.x = d.x + (target.x - d.x) * (damper + 0.02) * e.alpha;
					d.y = d.y + (target.y - d.y) * (damper + 0.02) * e.alpha;
			})
			circles
				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		});

	force.start();

})