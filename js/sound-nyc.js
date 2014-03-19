function drawMap()
{
    var width = 960,
        height = 500;

    var projection = d3.geo.mercator()
        .center([-73.963394165, 40.79])
        .scale(110000)
        .translate([width/2, height/2]);
        
    var path = d3.geo.path()
        .projection(projection);
        
    var svg = d3.select(".map").append("svg")
        .attr("width", width)
        .attr("height", height);
        
    var map = svg.append("g")
        .attr("transform", "rotate(0)")

    var count = 0;
    d3.json('./map/nyc.json', function(err, nyc) {
        map.selectAll("path")
            .data(nyc.features)
            .enter().append("path")
            .attr("class", function(d) {
                return d.geometry.type === "Polygon" ? "borough" : "roads";
            })
            .attr("d", path);
    });
}

$(document).ready(function() 
{
    drawMap();
});
