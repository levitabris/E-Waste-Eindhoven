var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName("body")[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight,scale0=(x-1)/2/Math.PI,svg=d3.select("body").style("margin","0").append("svg").attr({width:x,height:y}).style("background","#12151f");d3.select(window).on("resize",function(){x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight,svg.attr({width:x,height:y})});var projection=d3.geo.mercator().translate([x/2,y/2]).scale(14e3).center([5.478594,52.34337]),path=d3.geo.path().projection(projection),tooltip=d3.select("body").append("div").attr("class","hidden tooltip");d3.json("d/NL.json",function(e,t){if(e)return console.error(e);var n=topojson.feature(t,t.objects._nl),r=topojson.feature(t,t.objects._places);svg.selectAll(".netherland").data(n.features).enter().append("path").attr({"class":function(e){return"netherland "+e.properties.name},d:path});var o=!1;d3.csv("d/phonesCity.csv",function(e,t){return e?console.error(e):(svg.selectAll(".performanceBar").data(t).enter().append("rect").attr({"class":function(e){return"performanceBar "+e.Places+"Bar"},x:"-11px",y:function(e){return-10-e.Phones/10},width:"12px",height:function(e){return e.Phones/10},rx:"6px",ry:"6px",transform:function(e){return"translate("+projection([e.lng,e.lat])+")"}}).on("mousemove",function(e){var t=d3.mouse(svg.node()).map(function(e){return parseInt(e)});tooltip.classed("hidden",!1).attr("style","left:"+(t[0]+15)+"px; top:"+(t[1]-35)+"px").html("<h4>@"+e.Places+'</h4> <br> This city has <span style="font-weight: bold">  '+e.Phones+"</span> phones recycled."+e.CO2ByGram+" grams of carbon emmission is reduced by people in the city.")}).on("mouseout",function(){tooltip.classed("hidden",!0)}),svg.selectAll(".stop").data(t).enter().append("circle").attr({"class":function(e){return"stop "+e.Places},transform:function(e){var t=projection([e.lng,e.lat]);return t[1]+=-17,t[0]+=-5,"translate("+t+")"}}),d3.select(".EindhovenBar").on("click",function(){var e=0,t=0;o=o?!1:!0,e=o?"30%":"20px",t=o?".8":"0",d3.select("#sideBar").transition().style({width:e,opacity:t})}),void svg.selectAll(".stop-label").data(t).enter().append("text").text(function(e){return e.Places}).attr({"class":function(e){return"stop-label "+e.Places},transform:function(e){var t=projection([e.lng,e.lat]);return console.log(e.Places.length),t[0]+=-Math.round(2.8*e.Places.length),t[1]+=3,"translate("+t+")"}}).attr("dy",function(e){return"Oost-Nieuw-west"==e.Places?"1em":"0"}))})});