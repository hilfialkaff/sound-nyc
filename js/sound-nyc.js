/**
 * Find and replace all function for JavaScript strings.
 *
 * @see http://stackoverflow.com/a/1144788/837221
 */
function replaceAll( _find, _replace, _str )
{
	  return _str.replace( new RegExp(_find, 'g'), _replace);
}

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
	// Constant Values //
	var EICON_INNER_RADIUS = 2.0;
	var EICON_OUTER_RADIUS = 8.0;
	var EICON_OUTER_STROKE = 1.5;
	var ETOOLTIP_PADDING = 4.0;
	var ETOOLTIP_RADIUS = 5.0;

	// Helper Functions //
	var EVENTID_FXN = function( _data )
	{
		return replaceAll( " ", "_", _data[ "name" ] );
	};
	var EVENT_TRANSLATION_FXN = function( _data )
	{
		return "translate(" + _projection( _data["coordinates"] ) + ")";
	};
	var ETOOLTIP_TRANSLATION_FXN = function( _data )
	{
		var tooltipOffset = [
			EICON_OUTER_RADIUS + EICON_OUTER_STROKE + 2.0 * ETOOLTIP_PADDING,
			-EICON_OUTER_RADIUS
		];
		return "translate(" + tooltipOffset + ")";
	};
	var ETOOLTIP_SUMMARYTEXT_FXN = function( _data )
	{
		return _data[ "name" ].toUpperCase();
	};

	// Other Variables //
	var overlay = _map.append( "g" );
	var eventGroups = overlay.selectAll( ".event" )
		.data( _events ).enter().append( "g" )
		.attr( "id", EVENTID_FXN )
		.attr( "class", "event" )
		.attr( "transform", EVENT_TRANSLATION_FXN );

	// Create Event Indicators //
	{
		var eventIcons = eventGroups.append( "g" )
			.attr( "class", "event-icon" );

		eventIcons.append( "circle" )
			.attr( "cx", 0 ).attr( "cy", 0 )
			.attr( "r", EICON_INNER_RADIUS )
			.attr( "fill-opacity", 1.0 );

		eventIcons.append( "circle" )
			.attr( "cx", 0 ).attr( "cy", 0 )
			.attr( "r", EICON_OUTER_RADIUS )
			.attr( "fill-opacity", 0.0 )
			.attr( "stroke-width", EICON_OUTER_STROKE );
	}

	// Create Event Tooltips //
	{
		var eventTooltips = eventGroups.append( "g" )
			.attr( "class", "event-tooltip" )
			.attr( "transform", ETOOLTIP_TRANSLATION_FXN );

		var tooltipContainers = eventTooltips.append( "rect" )
			.attr( "class", "tooltip-container" )
			.attr( "x", -ETOOLTIP_PADDING ).attr( "y", -ETOOLTIP_PADDING )
			.attr( "rx", ETOOLTIP_RADIUS ).attr( "ry", ETOOLTIP_RADIUS )
			.attr( "width", 0 ).attr( "height", 0 );

		var tooltipHeadings = eventTooltips.append( "text" )
			.attr( "class", "tooltip-heading" )
			.attr( "dx", 0 ).attr( "dy", 0 )
			.attr( "text-anchor", "start" )
			.text( ETOOLTIP_SUMMARYTEXT_FXN );

		tooltipHeadings
			.attr( "dy", function( _data )
			{
				var tooltipHeading = d3.select( this );
				var boundingRect = tooltipHeading.node().getBBox();

				return boundingRect.height - ETOOLTIP_PADDING;
			} );

		tooltipContainers
			.attr( "width", function( _data )
			{
				var headingElement = d3.select( "#" + EVENTID_FXN( _data ) )
					.select( ".event-tooltip" )
					.select( ".tooltip-heading" );
				var boundingRect = headingElement.node().getBBox();

				return boundingRect.width + 2.0 * ETOOLTIP_PADDING;
			} )
			.attr( "height", function( _data )
			{
				var headingElement = d3.select( "#" + EVENTID_FXN( _data ) )
					.select( ".event-tooltip" )
					.select( ".tooltip-heading" );
				var boundingRect = headingElement.node().getBBox();

				return boundingRect.height + 2.0 * ETOOLTIP_PADDING;
			} );
	}
}

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
        // TODO @Joe circle stuff
        var eicon = d3.select(this);
        showEventName(eicon);
    });

    eventIcon.on("mouseout", function(d) {
        var eicon = d3.select(this);
        showEventName(eicon);
    });

    function showEventName(eicon)
    {
        var width = 300, height = 30, offset = 20;
        var max_width = 960, max_height = 500;

        eicon.select(".event-details")
            .remove();

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

    }

    function showEventDetails(eicon, d)
    {
        eventIcon.select(".event-details")
            .remove();
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
                } else {
                    var detail = d.properties.detail;
                    var majorRoads = ["Hwy", "Expy", "Brg", "Fwy", "Blvd"]
                    return majorRoads.indexOf(detail) > -1 ? "road" : "road-minor";
                }
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
		},
		{
			"name": "Shooting of John Lennon",
			"date": new Date( 1980, 12, 8, 0, 0, 0, 0 ),
			"location": "West 72nd Street, New York",
			"coordinates": [ -73.976297, 40.776122 ],
			"sound_radii": [ 0.0, 28.0, 127.0 ]
		}
	];

	populateMap( svg, projection, mapEvents );
	//addEventIcons(svg, projection, mapEvents);
}

$(document).ready(function() 
{
    drawMap();
});
