

// get window size
var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
// Creat zoom function 
var scale0 = (x - 1)/2/Math.PI;


// ceate svg canvas
var svg = d3.select("body").style('margin','0')
		.append("svg")
        .attr({
        	"width": x,
            "height": y
        })
        .style('background','#b1d8b7')
        ;

// detect resize window and change size accordingly
d3.select(window)
	.on('resize', function() {
		x = w.innerWidth || e.clientWidth || g.clientWidth;
    	y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    	svg.attr({
    		"width": x,
    		"height": y
    	});
	});

// projection and path for map drawing
var projection = d3.geo.mercator()
				.translate([x/2, y/2])
				.scale(11000)
				.center([5.478594,52.04337])
			;
                       
var path = d3.geo.path().projection(projection)
			;
//add a hidden tooltip div with undefined position
var tooltip =d3.select('body').append('div')
				.attr('class','hidden tooltip')
				;

// draw world map
d3.json('d/NL.json', function(err, nl) {
	if (err) return console.error(err);
	var netherland = topojson.feature(nl, nl.objects._nl);
	var nl_cities = topojson.feature(nl, nl.objects._places);

	svg.selectAll('.netherland').data(netherland.features).enter()
		.append('path')
		.attr({
			'class': function(d) { return "netherland " + d.properties.name},
			'd': path,
			'fill':'#608157'
		})			
		;
	svg.selectAll('.city').data(nl_cities.features).enter()
		.append('circle')
		.attr({
			'class': function(d) { return "city " + d.properties.name},
			'r': '2px',
			'fill':'#cfcfcf',
			"transform": function(d) { return "translate(" + path.centroid(d) + ")"; }
		})

	svg.selectAll('.city-label').data(nl_cities.features).enter()
		.append('text')
		.text( function(d) {return d.properties.name})
		.attr({
			'class': function(d) {return 'city-label ' + d.properties.name},
			"transform": function(d) { return "translate(" + projection(d.geometry.coordinates) + ")";},
    		"dy":"1.1em"			
		})
    	;

	var active = false;

    d3.csv('d/phonesCity.csv', function(err,d) {
		if (err) return console.error(err);
		console.log(d);
		svg.selectAll('.stop').data(d).enter()
			.append('circle')
			.attr({
				'class': function(d) {return 'stop ' + d.Places},
				'r': function(d) { return (d.Places == 'Eindhoven')? '6px':'5px'},
				'fill':function(d) { return (d.Places == 'Eindhoven')? '#2ed0de':'#FFF'},
				"transform": function(d) { return "translate(" + projection([d.lng,d.lat]) + ")";}
			})
			.on("click", function(d){
				if (d.Places == 'Eindhoven') {
					var newWidth = 0;
					active = active? false : true ;
		  			newWidth = active? '20%' : '0%';
					d3.select("#sideBar").style('width',newWidth);
				}
			})
			.transition()
			.duration(1200)
			;

		svg.selectAll('.stop-label').data(d).enter()
			.append('text')
			.text( function(d) {return d.Places})
			.attr({
				'class': function(d) {return 'stop-label ' + d.Places},
				"transform": function(d) { return "translate(" + projection([d.lng,d.lat]) + ")";},
	    		"dy":"1.4em"
			})
			.attr( 'dx', function(d) {return (d.Places == 'Oost-Nieuw-west')? '-1em':'0'} )
			;

		svg.selectAll('.performanceBar').data(d).enter()
			.append('rect')
			.attr({ 
				'class':'performanceBar',
				'width':'20px',
				'y': function (d) {return -10- d.Phones/10},
				'height' : function(d){return d.Phones/10},
				'x': '-11px',
				'fill': 'white',
				'opacity': '.7',
				"transform": function(d) { return "translate(" + projection([d.lng,d.lat]) + ")";},

			})
			.on('mousemove', function(d) {
		            var mouse = d3.mouse(svg.node()).map(function(d) {
		                return parseInt(d);
		            });
		            tooltip.classed('hidden', false)
		                .attr('style', 'left:' + (mouse[0] + 15) +'px; top:' + (mouse[1] - 35) + 'px')
		                .html('<h4>@'+ d.Places + '</h4> <br> This city has <span style="font-weight: bold">  ' + d.Phones + '</span> phones recycled.' + d.CO2ByGram + ' grams of carbon emmission is reduced by people in the city.');
		     })
		    .on('mouseout', function() {
		            tooltip.classed('hidden', true);
		     })

	});

});



// d3.csv('d/cityLocs.csv', function(d){
// 	console.log(d);
// 	d3.select('#locations').append('svg').append('g').attr('class','locBars' ).selectAll('.locPerformance').data(d).enter()
// 		.append('rect')
// 		.attr({
// 			'class':'locPerformance',
// 			'x': '0',
// 			'y':  function(d,i) { return i*12 },
// 			'width': function(d) { return d.Phones },
// 			'height': '10',
// 			'fill':'#FFF',
// 			'opacity': '.8'
// 		})
// 		.append('text')
// 		.text( function(d) { return d.School }) 
// 		;
  
// });



