function map(data) {

    var zoom = d3.behavior.zoom()
            .scaleExtent([0.5, 8])
            .on("zoom", move);

    var mapDiv = $("#map");

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = mapDiv.width() - margin.right - margin.left,
            height = mapDiv.height() - margin.top - margin.bottom;

    var curr_mag = 4;

    var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");

    var timeExt = d3.extent(data.map(function (d) {
        return format.parse(d.time);
    }));

    var filterdData = data;

    //Sets the colormap
    var colors = colorbrewer.Set3[10];

    //Assings the svg canvas to the map div
    var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

    var g = svg.append("g");

    //Sets the map projection
    var projection = d3.geo.mercator()
            .center([8.25, 56.8])
            .scale(700);

    //Creates a new geographic path generator and assing the projection        
    var path = d3.geo.path().projection(projection);

    //Formats the data in a feature collection trougth geoFormat()
    var geoData = {type: "FeatureCollection", features: geoFormat(data)};

    //Loads geo data
    d3.json("data/world-topo.json", function (error, world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        draw(countries);
    });

    //Calls the filtering function 
    d3.select("#slider").on("input", function () {
        filterMag(this.value, data);
    });

    var clusterOn = false;
    var color;

    //Formats the data in a feature collection
    function geoFormat(array) {
        var data = [];

        array.map(function (d, i) {
            //Complete the code
            var feature = {
                "type":"Feature",
                "geometry":{
                    "type":"Point",
                    "coordinates":[d.lat, d.lon]
                },
                "properties":{
                    "id":d.id,
                    "time":d.time,
                    "depth":d.depth,
                    "mag":d.mag,
                    "place":d.place
                }
            };
            data.push(feature);
        });

        return data; //GeoJSON format
    }

    //Draws the map and the points
    function draw(countries)
    {
        //draw map
        var country = g.selectAll(".country").data(countries);
        country.enter().insert("path")
                .attr("class", "country")
                .attr("d", path)
                .style('stroke-width', 1)
                .style("fill", "lightgray")
                .style("stroke", "white");

        //draw point   
        //Complete the code
        g.selectAll(".point").data(geoData.features)
            .enter().append("circle", ".point")
            .attr("r",5)
            .attr("transform", function(d){ 
                return "translate(" + projection([d.geometry.coordinates[0], d.geometry.coordinates[1]]) + ")"; }) //might be wrong
            .style("fill", "orange");
        

    };

    //Filters data points according to the specified magnitude
    function filterMag(value) {
        //Complete the code
    }

    //Filters data points according to the specified time window
    this.filterTime = function (value) {
        //Complete the code
        svg.selectAll("circle").remove();

        geoData.features = geoFormat(value); //right format

        g.selectAll(".point").data(geoData.features)
            .enter().append("circle", ".point")
            .attr("r",5)
            .attr("transform", function(d){ 
                return "translate(" + projection([d.geometry.coordinates[0], d.geometry.coordinates[1]]) + ")"; })
            .style("fill", function(d){ return (clusterOn) ? color(d.properties.i) : "orange"; });
        
    };

    //Calls k-means function and changes the color of the points  
    this.cluster = function () {
        //Complete the code
        clusterOn = true;

        svg.selectAll("circle").remove();

        var k = d3.select("#k").node().value;

        var kmeansRes = kmeans(geoData,k);

        //color scale
        color = d3.scale.linear().domain([1, k])
            .interpolate(d3.interpolateHcl)
            .range([d3.rgb("#ffff00"), d3.rgb("#ff00ff")]);

        g.selectAll(".point").data(kmeansRes.features)
            .enter().append("circle", ".point")
            .attr("r",5)
            .attr("transform", function(d){ 
                return "translate(" + projection([d.geometry.coordinates[0], d.geometry.coordinates[1]]) + ")"; })
            .style("fill", function(d){ return color(d.properties.i); });
    };

    //Zoom and panning method
    function move() {

        var t = d3.event.translate;
        var s = d3.event.scale;

        zoom.translate(t);
        g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
    }

    //Prints features attributes
    function printInfo(value) {
        var elem = document.getElementById('info');
        elem.innerHTML = "Place: " + value["place"] + " / Depth: " + value["depth"] + " / Magnitude: " + value["mag"] + "&nbsp;";
    }

}
