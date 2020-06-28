function makeResponsive() {

    // chart dimensions
    var svgWidth = 1000;
    var svgHeight = 600;
  
    // SVG margins
    var margin = {
      top: 20,
      right: 40,
      bottom: 90,
      left: 100
    };
  
    // chart area
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
  
    // SVG wrapper
    var svg = d3
      .select("#scatter")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);
  
    // append chart element
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // beginning parameters (defining to keep dynamic if doing challenge)
    var chosenXAxis = "poverty";
    var chosenYAxis = "healthcare";
  
    // create x and y scale functions for chosen axis
    function xScale(healthData, chosenXAxis) {
      var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
          d3.max(healthData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
      return xLinearScale;
    }
  
    function yScale(healthData, chosenYAxis) {
      var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
          d3.max(healthData, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);
      return yLinearScale;
    }
  
    // create circles for plot
    function createCircles(circlesGroup, chosenXAxis, chosenYAxis) {
      circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => d[chosenXAxis])
        .attr("cy", d => d[chosenYAxis]);
      return circlesGroup;
    }
  
    // create text for cirlces
    function createCirclesText(textGroup, chosenXAxis, chosenYAxis) {
  
      textGroup.transition()
     .duration(1000)
        .attr("x", d => d[chosenXAxis])
        .attr("y", d => d[chosenYAxis])
       .attr("text-anchor", "middle");
  
      return textGroup;
    }

    // import CSV
    d3.csv("assets/data/data.csv")
      .then(function(healthData) {
  
      // parse data (keeping only the initial categories chosen)
      healthData.forEach(function(data) {
        data.poverty = +data.poverty;
//        data.age = +data.age;
//        data.income = +data.income;
        data.healthcare = +data.healthcare;
//        data.obesity = +data.obesity;
//        data.smokes = +data.smokes;
      });
  
      //  xLinearScale & yLinearScale 
      var xLinearScale = xScale(healthData, chosenXAxis);
      var yLinearScale = yScale(healthData, chosenYAxis);
  
      // axis
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);
  
      // append xAxis to the chart
      var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
      // append yAxis to the chart
      var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);
  
      // create and append circles shape
      var circlesGroup = chartGroup.selectAll(".stateCircle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("class", "stateCircle")
        .attr("r", 15)
        .attr("opacity", ".75");
  
      // create and append circle text
      var textGroup = chartGroup.selectAll(".stateText")
        .data(healthData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]*.98))
        .text(d => (d.abbr))
        .attr("class", "stateText")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle")
        .attr("fill", "white");
  
      // create and append x and y axis labels
      var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
      var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // Value to Grab for Event Listener
        .classed("active", true)
        .text("Poverty (%)");
  
      var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(-25, ${height / 2})`);
      var healthcareLabel = yLabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("x", 0)
        .attr("value", "healthcare")
        .attr("dy", "1em")
        .classed("axis-text", true)
        .classed("active", true)
        .text("Lacks Healthcare (%)");
    });
  }
  // call make responsive function
  makeResponsive();
  d3.select(window).on("resize", makeResponsive);