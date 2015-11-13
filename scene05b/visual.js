console.log('called visual.js')

var margin = {top: 30, right: 30, bottom: 30, left: 50},
	width = 800 - margin.right - margin.left,
	height = 600 - margin.top - margin.bottom;

var eachSection = width/7;

var virusCenters = {
    "a": {x: eachSection},//, y: height/3},
	"b": {x: eachSection*2},//, y: height/3},
	"c": {x: eachSection*3},//, y: height/3},
	"d": {x: eachSection*4},//, y: height/1.5},
	"e": {x: eachSection*5},//, y: height/1.5}
	"f": {x: eachSection*6}
};

var virusCentersExpand = {
    "a": {x: eachSection, y: height/3},
	"b": {x: eachSection*2, y: height/3},
	"c": {x: eachSection*3, y: height/3},
	"d": {x: eachSection*4, y: height/1.5},
	"e": {x: eachSection*5, y: height/1.5},
	"f": {x: eachSection*6, y: height/1.5}
};

var virusImgs = {
	"a": "../VirusImages/0000-3635.png",
	"b": "../VirusImages/0003-0148.png",
	"c": "../VirusImages/0006-3199.png",
	"d": "../VirusImages/0007-3156.png",
	"e": "../VirusImages/0005-0386.png"
}

var svg = d3.select('#visual').append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var nodes = [],
	damper = 0.1;

//var yScale = d3.scale.ordinal()
//	.rangeRoundBands([height, 0]);
var yScale = d3.scale.linear()
	//.range([0, height-100]);
	.range([0, height-100]);

d3.json('virus.json', function(data) {
	console.log(data);

	data.nodes.forEach(function(d) {
		node = {
			virus: d.virus,
			virusInd: d.virusInd,
			//img: virusImgs[d.virus],
			//newLinkLen = Math.floor(Math.random() * 10) * d.virusInd,
			origLinkLen: d.origLinkLen,
			newLinkLen: d.newLinkLen,
			img: d.virusImg,
			x: Math.random() * 900,
			y: Math.random() * 800
		};
		nodes.push(node);
	}); // end of data.forEach()

	//yScale.domain(function(d) {return d.virus})
	//yScale.domain([0, d3.max(nodes, function(d) { return d.virusInd; }) ]);
	//yScale.domain([0, d3.max(nodes, function(d) { return d.virusInd; }) ]);
	//yScale.domain([0, d3.max(nodes, function(d) { return d.newLinkLen; }) ]);
	yScale.domain([0, 21]);


	var link = svg.selectAll('.link')
    	.data(data.links)
    	.enter().append('line')
    	.attr('class', 'link');

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
	    .attr("class", function(d) { return d.virus })
	    //.attr("xlink:href", "https://github.com/favicon.ico")
	    .attr("xlink:href", function(d) { return d.img})
	    .attr("x", "-25px")
	    .attr("y", "-25px")
	    .attr("width", "50px")
	    .attr("height", "50px");

	function charge(d) {
		return -20;
	}

	var force = d3.layout.force()
		.nodes(nodes)
		.links(data.links)
		.size([width, height]);

	circles.call(force.drag);

	force.gravity(-0.01)
		.charge(charge)
		.friction(0.95)
		//.friction(0.7)
		.on('tick', function(e) {
			force.nodes().forEach(function(d,i) {
				var target = virusCenters[d.virus];
				//d.x = d.x + (target.x - d.x) * (damper + 0.02) * e.alpha;
				d.x = d.x + (target.x - d.x) * (damper) * e.alpha;
				//d.y = d.y + (60 - d.y) * (damper + 0.02) * e.alpha;
				//d.y = i * 20;
				//d.y = yScale(d.virusInd);// - height/2;
				d.y = yScale(d.origLinkLen);
			})
			circles
				.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

			link
				.attr('x1', function(d) { return d.source.x; })
		        .attr('y1', function(d) { return d.source.y; })
		        .attr('x2', function(d) { return d.target.x; })
		        .attr('y2', function(d) { return d.target.y; });
		});

	force.start();

	// expand y
	setTimeout(function(){ 
		console.log('setTimeout() called')
		force
			.on('tick', function(e) {
				force.nodes().forEach(function(d,i) {
					var target = virusCentersExpand[d.virus];
					d.x = d.x + (target.x - d.x) * (damper) * e.alpha;
					//d.y = yScale(d.virusInd);
					d.y = yScale(d.newLinkLen);
				})
				circles
					.transition()
					.duration(1000)
					.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
				link
					.transition()
					.duration(1000)
					.attr('x1', function(d) { return d.source.x; })
			        .attr('y1', function(d) { return d.source.y; })
			        .attr('x2', function(d) { return d.target.x; })
			        .attr('y2', function(d) { return d.target.y; });
			});
			force.start();
	}, 1000); // end of setTimeout()

})