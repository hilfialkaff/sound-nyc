/**
 * Populates the map with the given events.
 *
 * @param _map The D3 SVG object into which the map contents will be loaded.
 * @param _projection The D3 projection function used to place coordinates.
 * @param _events A list of objects of the following form:
 *  {
 *      "name": string,
 *      "date": Date,
 *      "location": string,
 *      "coordinates": [ float, float ],        <-- [ longitude, latitude ]
 *      "sound_radii": [ float, float, float ]  <-- [ +160 dB, 159-120 dB, 120-85 dB ]
 *  }
 */
function populateMap( _map, _projection, _events )
{
	var overlay = _map.append( "g" );
	var projectionFunction = function( _data ) {
		return "translate(" + _projection( _data["coordinates"] ) + ")";
	};

	// Create the Event Indicators //
	{
		var eventIndicators = overlay.selectAll( ".event-indicator" )
			.data( _events ).enter().append( "g" )
			.attr( "id", function( _data ) { return _data["name"]; } )
			.attr( "class", "event-indicator" )
			.attr( "transform", projectionFunction );

		eventIndicators.append( "circle" )
			.attr( "cx", 0 ).attr( "cy", 0 )
			// TODO: Update the radius based on design wants/needs.
			.attr( "r", 5.0 )
			.attr( "fill", "red" )
			.style( "fill-opacity", 1.0 );

		eventIndicators.append( "circle" )
			.attr( "cx", 0 ).attr( "cy", 0 )
			// TODO: Update the radius based on design wants/needs.
			.attr( "r", 10.0 )
			.attr( "fill", "red" )
			.style( "fill-opacity", 0.0 );
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

    d3.json("map/nyctopo.json", function(err, json) {
    //d3.json('map/nyc.json', function(err, json) {
        map.selectAll("path")
            .data(topojson.feature(json, json.objects.nyc).features)
            //.data(json.features)
            .enter().append("path")
            .attr("class", function(d) {
                var type = d.properties.type;
                if (type === "boundary") {
                    return "boundary";
                }
                return "road";
            })
            .attr("d", path);
    });

	// TODO: Consider exporting this data to a JSON file instead.
	var mapEvents = [
		{
			"name": "Wall Street Bombing",
			"date": new Date( 1920, 9, 16, 0, 0, 0, 0 ),
			"location": "Wall Street, New York",
			"coordinates": [ -74.008741, 40.706148 ],
			"sound_radii": [ 5.0, 96.0, 261.0 ]
		}
	];

	populateMap( svg, projection, mapEvents );
}

$(document).ready(function() 
{
    drawMap();
});
