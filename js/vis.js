

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
        .style('background','#12151f')
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
				.scale(14000)
				.center([5.478594,52.34337])
			;
                       
var path = d3.geo.path().projection(projection)
			;
//add a hidden tooltip div with undefined position
var tooltip =d3.select('body').append('div')
				.attr('class','hidden tooltip')
				;

// ==================draw world map==================

d3.json('d/NL.json', function(err, nl) {
	if (err) return console.error(err);
	var netherland = topojson.feature(nl, nl.objects._nl);
	var nl_cities = topojson.feature(nl, nl.objects._places);

	svg.selectAll('.netherland').data(netherland.features).enter()
		.append('path')
		.attr({
			'class': function(d) { return "netherland " + d.properties.name},
			'd': path
		})			
		;

	// ================= dots for city position ================
	var active = false;

    d3.csv('d/phonesCity.csv', function(err,d) {
		if (err) return console.error(err);


		// ========= bars indication each city's performance============

		svg.selectAll('.performanceBar').data(d).enter()
			.append('rect')
			.attr({ 
				'class' : function(d) { return 'performanceBar ' + d.Places + 'Bar'},
				'x'		: '-11px',
				'y'		: function (d) {return -10- d.Phones/10},
				'width'	:'12px',
				'height': function(d){return d.Phones/10},
				'rx' 	: '6px',
				'ry' 	: '6px',
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
		     });


		svg.selectAll('.stop').data(d).enter()
			.append('circle')
			.attr({
				'class': function(d) {return 'stop ' + d.Places},
				"transform": function(d) { 
					var pos = projection([d.lng,d.lat]);
					pos[1] += -17;
					pos[0] += -5;
					return "translate(" + pos + ")";},
			})
		
			;
		d3.select('.EindhovenBar')	.on("click", function(){
					var newWidth = 0;
					var newAlpha = 0;
					active = active? false : true ;
		  			newWidth = active? '30%' : '20px';
		  			newAlpha = active? '.8' : '0';
					d3.select("#sideBar").transition().style({
						'width': newWidth,
						'opacity': newAlpha
					})
			})

	//==================== Add city name labels ======================

		svg.selectAll('.stop-label').data(d).enter()
			.append('text')
			.text( function(d) {return d.Places})
			.attr({
				'class': function(d) {return 'stop-label ' + d.Places},
				"transform": function(d) { 
					var pos = projection([d.lng,d.lat])
					console.log(d.Places.length);
					pos[0] += - Math.round(d.Places.length * 2.8);
					pos[1] += 3;
					return "translate(" + pos + ")";
				},
			})
			.attr( 'dy', function(d) {return (d.Places == 'Oost-Nieuw-west')? '1em':'0'} )
			;

	});

});




