function sp(){

    var self = this; // for internal d3 functions

    var spDiv = $("#sp");

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = spDiv.width() - margin.right - margin.left,
        height = spDiv.height() - margin.top - margin.bottom;

    //initialize color scale
    //...
    
    //initialize tooltip
    //...
    var toolTip = d3.select("body").append("div")   
        .attr("class", "tooltip")               
        .style("opacity", 0);

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#sp").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var dataMax;

    //Load data
    d3.csv("./data/OECD-better-life-index-hi.csv", function(error, data) {
        self.data = data;
        
        //define the domain of the scatter plot axes
        //...
        
        // get min and max for specific data attributes
        x.domain([d3.min(data, function(d){ return d["Water quality"]; }), d3.max(data, function(d){ return d["Water quality"]; })]);
        y.domain([d3.min(data, function(d){ return d["Employment rate"]; }), d3.max(data, function(d){ return d["Employment rate"]; })]);
        dataMax = d3.max(data, function(d){ return d["Unemployment rate"];});
        
        draw();

    });

    function draw()
    {
        
        // Add x axis and title.
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .text("Water quality")
            .attr("class", "label")
            .attr("x", width - width*0.1)
            .attr("y", -6);
            
            
        // Add y axis and title.
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .text("Employment rate")
            .attr("class", "label")
            .attr("transform", "rotate(0)")
            .attr("y", 6)
            .attr("dy", ".71em");
            
        // Add the scatter dots.
        svg.selectAll(".dot")
            .data(self.data)
            .enter()
            .append("text")
            .text(function(d){
                return d["Water quality"] + "," + d["Employment rate"];
            })
            .attr("x", function(d){
                return x(d["Water quality"]);
            })
            .attr("y", function(d){
                return y(d["Employment rate"]);
            });

        svg.selectAll(".dot")
            .data(self.data)
            .enter().append("circle")
            .attr("class", "dot")
            //Define the x and y coordinate data values for the dots
            //...
            .attr("cx", function(d){
                //console.log(d["Unemployment rate"]);
                return x(d["Water quality"]);
            })
            .attr("cy", function(d){
                //console.log(d["Employment rate"]);
                return y(d["Employment rate"]);
            })
            .attr("r", function(d){
                return 5; //10 * (d["Unemployment rate"] / dataMax);
            })
            .attr("fill", "red")
            .attr("x", function(d){
                return x(d["Water quality"]);
            })
            .attr("y", function(d){
                return y(d["Employment rate"]);
            })
            //tooltip
            .on("mousemove", function(d) {
                //...
                toolTip.transition()
                    .duration(200)
                    .style("opacity", 0.8);
                toolTip.html(d["Country"])
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");

            })
            .on("mouseout", function(d) {
                //...
                toolTip.transition()
                    .duration(200)
                    .style("opacity", 0.0);

            })
            .on("click",  function(d) {
                //...
                self.selectDot(d.Country);
                pc1.selectLine(d.Country);
            });
    }

    //method for selecting the dot from other components
    this.selectDot = function(value){
        //...
        svg.selectAll(".dot")
            .each(function(d){
                d3.select(this).style("fill", "red");
                if(value == d.Country){
                    d3.select(this).style("fill", "green");
                }
            });
    };

    this.brushDots = function(value){
        svg.selectAll(".dot").remove();

        svg.selectAll(".dot")
            .data(value)
            .enter().append("circle")
            .attr("class", "dot")
            //Define the x and y coordinate data values for the dots
            //...
            .attr("cx", function(d){
                //console.log(d["Unemployment rate"]);
                return x(d["Water quality"]);
            })
            .attr("cy", function(d){
                //console.log(d["Employment rate"]);
                return y(d["Employment rate"]);
            })
            .attr("r", function(d){
                return 5; //10 * (d["Unemployment rate"] / dataMax);
            })
            .attr("fill", "red")
            .attr("x", function(d){
                return x(d["Water quality"]);
            })
            .attr("y", function(d){
                return y(d["Employment rate"]);
            });
    };
    
    //method for selecting features of other components
    function selFeature(value){
        //...
    }

}




