function addEventIcons(_map,_projection,_events)
{
    var arc = d3.svg.arc()
        .innerRadius(20)
        .outerRadius(20)
        .startAngle(5.72)
        .endAngle(6.84);

    var pf = function(_data) {
        return "translate(" + _projection(_data["coordinates"]) + ")";
    };

    var eventIcon = _map.selectAll(".event-icon")
        .data(_events)
        .enter()
            .append("g")
            .attr("class", "event-icon")
            .attr("transform", pf);

    eventIcon.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 11)
        .attr("y2", -18);
        
    eventIcon.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", -11)
        .attr("y2", -18);

    eventIcon.append("circle")
        .attr("cx", 0)
        .attr("cy", -15)
        .attr("r", 2.0);

    eventIcon.append("path")
        .attr("d", arc);
}

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

    d3.json('map/nyctopo.json', function(err, json) {
    //d3.json('map/nyc.json', function(err, json) {
        map.selectAll("path")
            .data(topojson.feature(json, json.objects.nyc).features)
            //.data(json.features)
            .enter().append("path")
            .attr("class", function(d) {
                var type = d.properties.type;
                if (type === "boundary") {
                    return "boundary";
                } else {
                    var detail = d.properties.detail;
                    var majorRoads = ["Hwy", "Expy", "Brg", "Fwy", "Blvd"]
                    return majorRoads.indexOf(detail) > -1 ? "road" : "road-minor";
                }
            })
            .attr("d", path);
        
        var mapEvents = [
            {
                "name": "Wall Street Bombing",
                "date": new Date( 1920, 9, 16, 0, 0, 0, 0 ),
                "location": "Wall Street, New York",
                "coordinates": [ -74.008741, 40.706148 ],
                "sound_radii": [ 5.0, 96.0, 261.0 ]
            }
        ];
        
        addEventIcons(svg, projection, mapEvents);
    });
}

$(document).ready(function() 
{
    drawMap();
});
