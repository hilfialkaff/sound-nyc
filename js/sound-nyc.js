var width = 960,
    height = 700;

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

	var ECIRCLE_SCALE_FACTOR = 0.25; // TODO: Insert correct scaling factor!

	var EVENT_DELAY = 100;
	var EICON_TRANS_TIME = 400;
	var ECIRCLE_TRANS_TIME = 400;

	// Helper Functions //
	function getEventID( _eventData )
	{
		return replaceAll( " ", "_", _eventData[ "name" ] );
	}
	function getEventName( _eventID )
	{
		return replaceAll( "_", " ", _eventID );
	}
	function getEventTranslation( _eventData )
	{
		return "translate(" + _projection( _eventData["coordinates"] ) + ")";
	}

	function getEventRadiusFunction( _level )
	{
		return function( _eventData ) { return ECIRCLE_SCALE_FACTOR * _eventData["sound_radii"][_level]; }
	}
	
	function getDateString( _eventData )
	{
		return d3.time.format( "%B %e, %Y" )(_eventData[ "date" ]);
	}

	// Other Variables //
	var overlay = _map.append( "g" );
	var eventGroups = overlay.selectAll( ".event" )
		.data( _events ).enter().append( "g" )
		.attr( "id", getEventID )
		.attr( "class", "event" )
		.attr( "transform", getEventTranslation );

	// Create Event Icons //
	{
		var eventIcons = eventGroups.append( "g" )
			.attr( "class", "event-icon" );

		eventIcons.append( "circle" )
			.attr( "class", "inner-circle" )
			.attr( "cx", 0 ).attr( "cy", 0 )
			.attr( "r", EICON_INNER_RADIUS )
			.attr( "fill-opacity", 1.0 );
		eventIcons.append( "circle" )
			.attr( "class", "outer-circle" )
			.attr( "cx", 0 ).attr( "cy", 0 )
			.attr( "r", EICON_OUTER_RADIUS )
			.attr( "fill-opacity", 0.0 )
			.attr( "stroke-width", EICON_OUTER_STROKE );
	}

	// Create Event Circles //
	{
		var eventCircles = eventGroups.append( "g" )
			.attr( "class", "event-circle" );

		eventCircles.append( "circle" )
			.attr( "class", "minor" )
			.attr( "cx", 0 ).attr( "cy", 0 )
			.attr( "r", getEventRadiusFunction(2) )
			.attr( "r", 0 );
		eventCircles.append( "circle" )
			.attr( "class", "major" )
			.attr( "cx", 0 ).attr( "cy", 0 )
			.attr( "r", getEventRadiusFunction(1) )
			.attr( "r", 0 );
		eventCircles.append( "circle" )
			.attr( "class", "eardrum" )
			.attr( "cx", 0 ).attr( "cy", 0 )
			.attr( "r", getEventRadiusFunction(0) )
			.attr( "r", 0 );
	}

	// Create Event Icon/Circle Cycling Behavior //
	{
		eventGroups.on( "click", function( _eventData ) {
			var eventGroup = d3.select( this );
            transitionCircle(eventGroup, _eventData);
		} );
	}

	// Create Event Tooltips //
	{
		$( ".event" ).each( function() {
			var eventID = $( this ).attr( "id" );
			var eventName = getEventName( eventID );

			$( this ).qtip( {
				content: eventName,
				position: { my: "center left", at: "center right" },
				style: { classes: "qtip-shadow qtip-rounded event-tooltip" },
				show: {
					effect: function() { $( this ).fadeTo(300, 1); }
				},
				hide: false,
			} );
		} );
	}

	// Create Tooltip Hovering Behavior //
	{
		eventGroups.on( "mouseover", function( _eventData ) {
			var d3EventGroup = d3.select( this );
			var eventID = d3EventGroup.attr( "id" );
			var jqEventGroup = $( "#" + eventID );

			jqEventGroup.qtip( "option", "content.text",
				_eventData[ "name" ] + "</br>" +
				"Location: " + _eventData[ "location" ] + "</br>" +
				"Date: " + getDateString( _eventData ) + "</br>" +
				"Loudness: " + _eventData[ "loudness" ] + " dB" );
		} );
		eventGroups.on( "mouseout", function( _eventData ) {
			var d3EventGroup = d3.select( this );
			var eventID = d3EventGroup.attr( "id" );
			var jqEventGroup = $( "#" + eventID );

			jqEventGroup.qtip( "option", "content.text",
				_eventData[ "name" ] );
		} );
	}
}

function transitionCircle(eventGroup, eventData)
{
    // Constants
    var EICON_INNER_RADIUS = 2.0;
	var EICON_OUTER_RADIUS = 8.0;
	var EICON_OUTER_STROKE = 1.5;

	var ECIRCLE_SCALE_FACTOR = 0.25; // TODO: Insert correct scaling factor!

	var EVENT_DELAY = 100;
	var EICON_TRANS_TIME = 400;
	var ECIRCLE_TRANS_TIME = 400;

    // helper functions
	function getEventRadiusFunction( _level )
	{
		return function( _eventData ) { return ECIRCLE_SCALE_FACTOR * _eventData["sound_radii"][_level]; }
	}


    var eventIcon = eventGroup.select( ".event-icon" );
    var eventCircle = eventGroup.select( ".event-circle" );

    var eventIconInner = eventIcon.select( ".inner-circle" );
    var eventIconOuter = eventIcon.select( ".outer-circle" );
    var eventCircleEardrum = eventCircle.select( ".eardrum" );
    var eventCircleMajor = eventCircle.select( ".major" );
    var eventCircleMinor = eventCircle.select( ".minor" );

    var toCircles = eventIcon.select( "circle" ).attr( "r" ) !== "0";
    var iconDelay = toCircles ? 0 : ECIRCLE_TRANS_TIME + EVENT_DELAY;
    var circleDelay = toCircles ? EICON_TRANS_TIME + EVENT_DELAY : 0;

    eventIconInner.transition()
        .duration( EICON_TRANS_TIME ).delay( iconDelay )
        .attr( "r", toCircles ? 0 : EICON_INNER_RADIUS );
    eventIconOuter.transition()
        .duration( EICON_TRANS_TIME ).delay( iconDelay )
        .attr( "r", toCircles ? 0 : EICON_OUTER_RADIUS );

    eventCircleEardrum.transition()
        .duration( ECIRCLE_TRANS_TIME ).delay( circleDelay )
        .attr( "r", toCircles ? getEventRadiusFunction(0)(eventData) : 0 );
    eventCircleMajor.transition()
        .duration( ECIRCLE_TRANS_TIME ).delay( circleDelay )
        .attr( "r", toCircles ? getEventRadiusFunction(1)(eventData) : 0 );
    eventCircleMinor.transition()
        .duration( ECIRCLE_TRANS_TIME ).delay( circleDelay )
        .attr( "r", toCircles ? getEventRadiusFunction(2)(eventData) : 0 );
}

/**
 * Draw the legend on the svg.
 * @param svg The svg to draw the legend on.
 */
function drawLegend(svg)
{
    var g = svg.append("g")
        .attr("class", "legend");


    var LEGEND_WIDTH = 350,
        LEGEND_HEIGHT = 100,
        LEGEND_RMARGIN = 10,
        LEGEND_BMARGIN = 5,
        LEGEND_RX = 10,
        LEGEND_RY = 10,
        LEGEND_X = width - LEGEND_WIDTH - LEGEND_RMARGIN,
        LEGEND_Y = height - LEGEND_HEIGHT - LEGEND_BMARGIN;

    {
        // draw the main box
        g.append("rect")
            .attr("class", "legend-box")
            .attr("x", LEGEND_X)
            .attr("y", LEGEND_Y)
            .attr("width", LEGEND_WIDTH)
            .attr("height", LEGEND_HEIGHT)
            .attr("rx", LEGEND_RX)
            .attr("ry", LEGEND_RY);
    }

    var R_LMARGIN = 10,
        R_TMARGIN = 15,
        R_RX = R_RY = 4,
        R_WIDTH = 23,
        R_HEIGHT = 8,
        R_BETWEEN_OFFSET = 20,
        R_X = LEGEND_X + R_LMARGIN,
        R_EARDRUM_Y = LEGEND_Y + R_TMARGIN,
        R_MAJOR_Y = R_EARDRUM_Y + R_BETWEEN_OFFSET,
        R_MINOR_Y = R_MAJOR_Y + R_BETWEEN_OFFSET;

    {
        // draw the legend rectangles
        g.append("rect")
            .attr("class", "eardrum")
            .attr("x", R_X)
            .attr("y", R_EARDRUM_Y)
            .attr("width", R_WIDTH)
            .attr("height", R_HEIGHT)
            .attr("rx", R_RX)
            .attr("ry", R_RY);

        g.append("rect")
            .attr("class", "major")
            .attr("x", R_X)
            .attr("y", R_MAJOR_Y)
            .attr("width", R_WIDTH)
            .attr("height", R_HEIGHT)
            .attr("rx", R_RX)
            .attr("ry", R_RY);

        g.append("rect")
            .attr("class", "minor")
            .attr("x", R_X)
            .attr("y", R_MINOR_Y)
            .attr("width", R_WIDTH)
            .attr("height", R_HEIGHT)
            .attr("rx", R_RX)
            .attr("ry", R_RY);
    }

    var T_X = R_X + R_WIDTH + 5,
        T_BETWEEN_OFFSET = 20,
        T_EARDRUM_Y = R_EARDRUM_Y + 6,
        T_MAJOR_Y = T_EARDRUM_Y + T_BETWEEN_OFFSET,
        T_MINOR_Y = T_MAJOR_Y + T_BETWEEN_OFFSET,
        T_SAFE_Y = T_MINOR_Y + T_BETWEEN_OFFSET;

    {
        // add the text for the legend
        g.append("text")
            .attr("x", T_X)
            .attr("y", T_EARDRUM_Y)
            .text("[+160DB] INSTANT PERFORATION OF EARDRUM");

        g.append("text")
            .attr("x", T_X)
            .attr("y", T_MAJOR_Y)
            .text("[159-120DB] HAZARDOUS SOUND LEVEL");

        g.append("text")
            .attr("x", T_X)
            .attr("y", T_MINOR_Y)
            .text("[119-85DB] POTENTIALLY HAZARDOUS SOUND LEVEL");

        g.append("text")
            .attr("x", T_X)
            .attr("y", T_SAFE_Y)
            .text("[84-0DB] SAFE");
    }

}

function drawPlayAll(svg, events)
{
	// Helper Functions //
	function getEventID( _eventData )
	{
		return replaceAll( " ", "_", _eventData[ "name" ] );
	}

    var g = svg.append("g")
            .attr("class", "playall");

    // draw the play all circles
    {
        g.append( "circle" )
            .attr( "cx",  860).attr( "cy", 535 )
            .attr( "r", 8 )
            .attr( "fill-opacity", 1.0 );
        g.append( "circle" )
            .attr( "cx", 860 ).attr( "cy", 535 )
            .attr( "r", 32 )
            .attr( "fill-opacity", 0.0 )
            .attr( "stroke-width", 2.5 );
    }

    // draw the play all text
    {
        g.append("text")
            .attr("x", 810)
            .attr("y", 587)
            .text("PLAY ALL");
    }

    // trigger the events
    {
        g.on("click", function() {
            for(var i = 0; i < events.length; i++) {
                var e = events[i];
                var id = getEventID(e);
                var eventGroup = d3.select("#"+id);
                var eventIcon = eventGroup.select(".event-icon")
                var isExpanded = eventIcon.select("circle").attr("r") === "0";

                if (!isExpanded)
                    transitionCircle(eventGroup, e);
            }
        });
    }
}

function drawMap()
{

    var projection = d3.geo.mercator()
        .center([-74, 40.79])
        .scale(320000)
        .translate([width/6, height/50]);
        
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
        map.selectAll("path")
            .data(topojson.feature(json, json.objects.nyc).features)
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
        
	    populateMap( svg, projection, mapEvents );
        drawPlayAll(svg, mapEvents);
        drawLegend(svg);

        stopLoadingScreen();
    });

}

/**
 * Stop the circle from spinning in the loading screen
 */
function stopLoadingScreen()
{
    var contents = $(".spinner").contents();
    $(".spinner").replaceWith(contents);
    
    contents = $(".mask").contents();
    $(".mask").replaceWith(contents);
}


$(document).ready(function() 
{
    // remove container once the play button is clicked
    $(".play").click(function () {
        $(".loading").fadeOut(300, function() {
            $(this).remove();
        });
		$( ".event" ).each( function() {
			$( this ).qtip( "api" ).show();
		} );
    });

    drawMap();
});
