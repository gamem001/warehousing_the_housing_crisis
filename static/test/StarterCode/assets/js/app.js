let svgWidth = 960;
let svgHeight = 500;

let margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
let svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//append an SVG group
let chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//initial params
let chartData = null;

let chosenXAxis = 'poverty'
let chosenYAxis = 'healthcare'

let xAxisLabels = ["poverty", "age", "income"];  // Default 
let yAxisLabels = ["obesity", "smokes", "healthcare"];
let labelsTitle = { "poverty": "In Poverty (%)", 
                    "age": "Age (Median)", 
                    "income": "Household Income (Median)",
                    "obesity": "Obese (%)", 
                    "smokes": "Smokes (%)", 
                    "healthcare": "Lacks Healthcare (%)" };

function xScale(healthData,chosenXAxis){
  let xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d=>d[chosenXAxis])*0.9, d3.max(healthData,d=>d[chosenXAxis])*1.1])
      .range([0,width])
  return xLinearScale;

}

function yScale(healthData, chosenYAxis) {
  // Create Scales.
  let yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenYAxis]) * .9,d3.max(healthData, d => d[chosenYAxis]) * 1.1 ])
      .range([height, 0]);

  return yLinearScale;
}

    // Function used for updating xAxis let upon click on axis label.
function renderXAxes(newXScale, xAxis) {
  let bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

  return xAxis;
}

  // Function used for updating yAxis let upon click on axis label.
  function renderYAxes(newYScale, yAxis) {
    let leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
          .duration(1000)
          .call(leftAxis);
  
    return yAxis;
  }
  
  // Function used for updating circles group with a transition to new circles.
  function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }
  
  // Function used for updating text in circles group with a transition to new text.
  function renderText(circletextGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circletextGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]))
      .attr("y", d => newYScale(d[chosenYAxis]));
        
    return circletextGroup;
  }
  
  // Function used for updating circles group with new tooltip.
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  
    // X Axis
    if (chosenXAxis === "poverty") {
        let xlabel = "Poverty: ";
    }
    else if (chosenXAxis === "income") {
        let xlabel = "Median Income: "
    }
    else {
        let xlabel = "Age: "
    }
  
    // Y Axis
    if (chosenYAxis === "healthcare") {
        let ylabel = "Lacks Healthcare: ";
    }
    else if (chosenYAxis === "smokes") {
        let ylabel = "Smokers: "
    }
    else {
        let ylabel = "Obesity: "
    }
  
    let toolTip = d3.tip()
    .attr("class", "tooltip")
    .style("background", "black")
    .style("color", "white")
    .offset([120, -60])
    .html(function(d) {
        if (chosenXAxis === "age") {
            // All yAxis tooltip labels presented and formated as %.
            // Display Age without format for xAxis.
            return (`${d.state}<hr>${xlabel} ${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
          } else if (chosenXAxis !== "poverty" && chosenXAxis !== "age") {
            // Display Income in dollars for xAxis.
            return (`${d.state}<hr>${xlabel}$${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}%`);
          } else {
            // Display Poverty as percentage for xAxis.
            return (`${d.state}<hr>${xlabel}${d[chosenXAxis]}%<br>${ylabel}${d[chosenYAxis]}%`);
          }      
    });
  
    circlesGroup.call(toolTip);
    //mouseon event
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
    //mouseout event
     .on("mouseout", function(data,index) {
      toolTip.hide(data)
    });
  
  return circlesGroup;
  }
  
  
  // Import Data
  d3.csv("static/test/StarterCode/assets/data/data.csv").then(function(healthData) {
  
      // Step 1: Parse Data/Cast as numbers
      // ==============================
      healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.age = +data.age;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
      });
  
      // Step 2: xlinear scale function above csv import
      // ==============================
      let xLinearScale = xScale(healthData, chosenXAxis);
      let yLinearScale = yScale(healthData, chosenYAxis);
  
  
      // Step 3: Create xy axis functions
      // ==============================
      let bottomAxis = d3.axisBottom(xLinearScale);
      let leftAxis = d3.axisLeft(yLinearScale);
  
      // Step 4: Append Axes to the chart
      // ==============================
      let xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
      let yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);
  
        
      // Step 5: Create Circles
      // ==============================
      let circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", "15")
      .attr("fill", "pink")
      .attr("opacity", ".5");
  
      // Add State abbr. text to circles. and some offset to y
      let circletextGroup = chartGroup.selectAll()
      .data(healthData)
      .enter()
      .append("text")
      .text(d => (d.abbr))
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .style("font-size", "11px")
      .style("text-anchor", "middle")
      .style('fill', 'black');
  
      let labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
      let povertyLabel = labelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 0)
          .attr("value", "poverty") // value to grab for event listener.
          .classed("active", true)
          .text("In Poverty (%)");
      
      let healthcareLabel = labelsGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", (margin.left) * 2.8)
          .attr("y", 0 - (height+12))
          .attr("value", "healthcare") // value to grab for event listener.
          .classed("active", true)
          .text("Lacks Healthcare (%)");
  
      let ageLabel = labelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 20)
          .attr("value", "age") // value to grab for event listener.
          .classed("inactive", true)
          .text("Age (Median)");
  
      let smokeLabel = labelsGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", (margin.left) * 2.8)
          .attr("y", 0 - (height +32))
          .attr("value", "smokes") // value to grab for event listener.
          .classed("inactive", true)
          .text("Smokes (%)");
  
      let incomeLabel = labelsGroup.append("text")
          .attr("x", 0)
          .attr("y", 40)
          .attr("value", "income") // value to grab for event listener.
          .classed("inactive", true)
          .text("Household Income (Median)");
  
      let obesityLabel = labelsGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("x", (margin.left) * 2.8)
          .attr("y", 0 - (height +52))
          .attr("value", "obesity") // value to grab for event listener.
          .classed("inactive", true)
          .text("Obesity (%)");
  
      // Update tool tip function above csv import.
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
      // X Axis labels event listener.
      labelsGroup.selectAll("text")
          .on("click", function() {
          // Get value of selection.
            let value = d3.select(this).attr("value");
            console.log(value)
  
          //if select x axises
            if (true) {
                if (value === "poverty" || value === "age" || value === "income") {
                  // Replaces chosenXAxis with value.
                  chosenXAxis = value;
  
                  // Update x scale for new data.
                  xLinearScale = xScale(healthData, chosenXAxis);
  
                  // Updates x axis with transition.
                  xAxis = renderXAxes(xLinearScale, xAxis);
  
                  // Update circles with new x values.
                  circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
  
                  // Update tool tips with new info.
                  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
                  // Update circles text with new values.
                  circletextGroup = renderText(circletextGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
  
                  // Changes classes to change bold text.
                  if (chosenXAxis === "poverty") {
                      povertyLabel
                          .classed("active", true)
                          .classed("inactive", false);
  
                      ageLabel
                          .classed("active", false)
                          .classed("inactive", true);
                      
                      incomeLabel
                          .classed("active", false)
                          .classed("inactive", true);
                  }
                  else if (chosenXAxis === "age"){
                      povertyLabel
                          .classed("active", false)
                          .classed("inactive", true);
  
                      ageLabel
                          .classed("active", true)
                          .classed("inactive", false);
  
                      incomeLabel
                          .classed("active", false)
                          .classed("inactive", true);
                  }
                  else {
                      povertyLabel
                          .classed("active", false)
                          .classed("inactive", true);
  
                      ageLabel
                          .classed("active", false)
                          .classed("inactive", true)
  
                      incomeLabel
                          .classed("active", true)
                          .classed("inactive", false);
                  }}
  
             else {
                      chosenYAxis = value;
                      //console.log("you choosed y axis")
                
                      // Update y scale for new data.
                      yLinearScale = yScale(healthData, chosenYAxis);
  
                      // Updates y axis with transition.
                      yAxis = renderYAxes(yLinearScale, yAxis);
  
                      // Update circles with new x values.
                      circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
  
                      // Update tool tips with new info.
                      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
                      // Update circles text with new values.
                      circletextGroup = renderText(circletextGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
  
                      // Changes classes to change bold text.
                      if (chosenYAxis === "healthcare") {
  
                          healthcareLabel
                              .classed("active", true)
                              .classed("inactive", false);
  
  
                          smokeLabel
                              .classed("active", false)
                              .classed("inactive", true);
  
                          obesityLabel
                              .classed("active", false)
                              .classed("inactive", true);
                            }
                      else if (chosenYAxis === "smokes"){
                          healthcareLabel
                              .classed("active", false)
                              .classed("inactive", true);
  
                          smokeLabel
                              .classed("active", true)
                              .classed("inactive", false);
  
                          obesityLabel
                              .classed("active", false)
                              .classed("inactive", true);
                            }
                      else {
                          healthcareLabel
                              .classed("active", false)
                              .classed("inactive", true);
  
                          smokeLabel
                              .classed("active", false)
                              .classed("inactive", true);
  
                          obesityLabel
                              .classed("active", true)
                              .classed("inactive", false);
                          }
                     } 
                    }
                  
            });
      
      });