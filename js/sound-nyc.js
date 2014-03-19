function drawMap()
{
    var width = 960,
        height = 500;

    var projection = d3.geo.mercator()
        .center([-73.963394165, 40.79])
        .scale(150000)
        .translate([width/4, height/3]);
        
    var path = d3.geo.path()
        .projection(projection);
        
    var svg = d3.select(".map").append("svg")
        .attr("width", width)
        .attr("height", height);
        
    svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            .attr("class", "background");
        
    var map = svg.append("g")
        .attr("transform", "rotate(0)")

    var count = 0;
    d3.json('./map/nyc.json', function(err, nyc) {
        map.selectAll("path")
            .data(nyc.features)
            .enter().append("path")
            .attr("class", function(d) {
                if (d.geometry.type === "Polygon") return "borough";
                else if (d.properties.featurecla === "River"){
                    console.log(d);
                    return "river";
                }
                return getRoadType(d);
            })
            .attr("d", path);


        function getRoadType(d)
        {
            var type = d.properties.type;
            if (type === "Freeway") return "road-freeway";
            else if (type === "Tollway") return "road-tollway";
            else if (d.properties.type === "Primary") return "road-primary";
            return "road";
        }
    });
}

$(document).ready(function() 
{
    drawMap();
});
