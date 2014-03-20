function drawMap()
{
    var width = 960,
        height = 500;

    var projection = d3.geo.mercator()
        .center([-74, 40.79])
        .scale(250000)
        .translate([width/5, height/50]);
        
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
        
    var map = svg.append("g");

    var count = 0;
    d3.json('./map/nyc.json', function(err, nyc) {
        map.selectAll("path")
            .data(nyc.features)
            .enter().append("path")
            .attr("class", function(d) {
                if ("borough" in d.properties) {
                    return "borough";
                }
                else if ("park" in d.properties) {
                    return "park";
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
