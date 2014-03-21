function addEventIcons(_map,_projection,_events)
{
    var arc = d3.svg.arc()
        .innerRadius(15)
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

    /*
    eventIcon.append("circle")
        .attr("cx", 0)
        .attr("cy", -15)
        .attr("r", 2.0);
    */

    eventIcon.append("path")
        .attr("d", arc);

    showEventName(eventIcon);

    eventIcon.on("mouseover", function(d) {
        var eicon = d3.select(this);
        showEventDetails(eicon);
    });

    eventIcon.on("click", function(d) {
        // TODO call Joe's circle function
        var eicon = d3.select(this);
        showEventName(eicon);
    });

    eventIcon.on("mouseout", function(d) {
        var eicon = d3.select(this);
        showEventName(eicon);
    });

    function showEventName(eicon)
    {
        eicon.selectAll(".event-details").remove();
        _drawDetailsBox(eicon, 250, 30, 20);

        var t = eicon.selectAll("text.event-details");
        t.text(function(d) { return d["name"].toUpperCase(); });
    }

    function showEventDetails(eicon)
    {
        eicon.selectAll(".event-details").remove();
    }

    function _drawDetailsBox(eicon, width, height, offset)
    {
        var max_width = 960, max_height = 500;

        eicon.append("rect")
            .attr("class", "event-details")
            .attr("x", function(d) {
                var xprojection = _projection(d["coordinates"])[0];

                if ( xprojection + width + offset <= max_width ) return offset;
                else return max_width - (xprojection + width + offset);
            })
            .attr("y", function(d) {
                var yprojection = _projection(d["coordinates"])[1];

                if (yprojection + height <= max_height) return 0;
                else return max_height - (yprojection + height);
            })
            .attr("width", width)
            .attr("height", height);

        eicon.append("text")
            .attr("class", "event-details")
            .attr("x", function(d) {
                var toffset = offset+10;
                var xprojection = _projection(d["coordinates"])[0];

                if (xprojection + width + toffset <= max_width) return toffset;
                else return max_width - (xprojection + width + toffset);
            })
            .attr("y", function(d) {
                var yprojection = _projection(d["coordinates"])[1];

                if (yprojection + height <= max_height) return height/2;
                else return max_height - (yprojection + height) + height/2;
            })
            .attr("dy", ".35em")
            .text("");
    }
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
