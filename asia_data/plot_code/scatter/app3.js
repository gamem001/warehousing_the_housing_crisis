function makeResponsive() {

  let svgArea = d3.select("#scatter").select("svg");

  //remove elements that are in svgArea
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  //setting svgArea
  let svgWidth = 1000;
  let svgHeight = 900;

  // Setting the margins that will be used to get a chart area
  let margin = {
    top: 50,
    right: 20,
    bottom: 80,
    left: 100
  };
  
  //chart area
  let width = svgWidth - margin.left - margin.right;
  let height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  let svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Append an SVG group
  let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Initial Params
  let someX = "homeless";
  let someY = "housing";

  // update x scale when clicking the  X axis label
  function xScale(allData, someX) {
      // console.log(someX)
      let xLinearScale = d3.scaleLinear()
        .domain([d3.min(allData, d => d[someX]) * .2, d3.max(allData, d => d[someX]) * 1.1])
        .range([0, width]);
      return xLinearScale;      
  }

  // update y scale when clicking the y axis label
  function yScale(allData, someY) {
      let yLinearScale = d3.scaleLinear()
          .domain([d3.min(allData, d => d[someY]) * .9, d3.max(allData, d=> d[someY]) * 1.1])
          .range([height, margin.top]);
      return yLinearScale;
  }
    // update xAxis on click
  function renderAxesX(xAxisScale, xAxis) {
      // console.log(xAxis)
      let bottomAxis = d3.axisBottom(xAxisScale);
      xAxis.transition()
        .duration(1000)
        .call(bottomAxis);  
      return xAxis;
  }

  // update yAxis on click
  function renderAxesY(yAxisScale, yAxis) {
      let leftAxis = d3.axisLeft(yAxisScale);
      yAxis.transition()
          .duration(1000)
          .call(leftAxis);
      return yAxis;
  }

       // function used for updating circles labels positions for x axis
  function renderTextX(textLabels, xAxisScale, someX) {
      textLabels.transition()
        .duration(1000)
        .attr('x', d => xAxisScale(d[someX]));
      return textLabels;
  }

  // update circle label positions for y axis change
  function renderTextY(textLabels, yAxisScale, someY) {
      textLabels.transition()
        .duration(1000) 
        .attr('y', d => yAxisScale(d[someY]));
      return textLabels;
  }

  // function used for updating circles group with a transition to new circles
  function renderCirclesX(circlesGroup, xAxisScale, someX) {
      // console.log("render circles");
      circlesGroup.transition()
          .duration(1000)
          .attr("cx", d => xAxisScale(d[someX]));    
  return circlesGroup;
  }
    
  //update circles group with a transition to new circles
  function renderCirclesY(circlesGroup, yAxisScale, someY) {
      circlesGroup.transition()
          .duration(1000)
          .attr("cy", d => yAxisScale(d[someY]));
      return circlesGroup;
  }

  // function used for updating x circles group with new tooltip
  function updateToolTip(someX, someY, circlesGroup) {

    // let label;
    
      if (someX === "Total_Homeless") {
          labelX = "Total Homeless: ";
      }
      else {
          labelX = "Average Income: ";
      }
      if (someY === 'avg_rent') {
          labelY = "Average Rental Price: "
      }
      else {
          labelY = "Average Sale Price: "
      }

    let toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([20, -60])
        .html(function(d) {
        return (`<h5><strong>${d.State}<strong><h5><hr><h6>${labelX}${d[someX]}<h6>${labelY} ${d[someY]}<h6>`);
        });
        // <hr>${label} ${d[someX]}
      
    circlesGroup.call(toolTip);
      // do i need 'this'
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data)
        .style("display", "block")
        .style("left", d3.event.pageX + 'px')
        .style("top", d3.event.pageY + "px");
    })
    // onmouseout event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });
  
    return circlesGroup;
  };
  // original path = /plot_code/scatter/data/data.csv
  const url = "/api/v1.0/data_2016";
  d3.json(url).then(function(response) {

    let allData = response;
     
    // parse data
    allData.forEach(function(data) {
      data.Total_Homeless = +data.Total_Homeless;
      data.average_incomes = +data.average_incomes;
      data.avg_rent = +data.avg_rent;
      data.avg_sale_price = +data.avg_sale_price;
    });
    console.log(allData);
    // xLinearScale function above csv import
    let xLinearScale = xScale(allData, someX);
    let yLinearScale = yScale(allData, someY);
      
    // Create initial axis functions
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);
      
    // append x axis
    let xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    let yAxis = chartGroup.append("g")
      .classed("Y-axis", true)
    //   .attr("transform", `t`)
      .call(leftAxis);
      
    // append initial circles
    let circlesGroup = chartGroup.selectAll("circle")
      .data(allData)
      .enter()
      .append("circle")
      .classed('circles', true)
      .attr("cx", d => xLinearScale(d[someX]))
      .attr("cy", d => yLinearScale(d[someY]))
      .attr("r", 20)
      .attr("fill", "teal")
      .attr("opacity", ".65")
      .attr("stroke", "black")
  
    let circleText = chartGroup.selectAll(null)
      .data(allData)
      .enter()
      .append("text")
      .classed('circles-text', true)
  
    let textLabels = circleText 
      .attr("x", d => xLinearScale(d[someX]))
      .attr("y", d => yLinearScale(d[someY]))
      .text(function(d) {return d.Code})
      .attr("font-size", "12px")
      .attr("font-family", "sans-serif")
      .attr("fill", "black")
      .attr("font-weight", "bold")
      .attr('text-anchor', 'middle');
        
    // Create group for two x-axis labels
    let xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
        
    // one label on x axis
    let homelessLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "Total_Homeless") // value to grab for event listener
      .classed("active", true)
      .text("Total Homeless");
        
    //another label on x axis
    let avgIncome = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "average_incomes") // value to grab for event listener
      .classed("inactive", true)
      .text("Median Income");
      
    let ylabelsGroup = chartGroup.append('g')
                
    let avgRent = ylabelsGroup.append('text')
        .attr("transform", "rotate(-90)")
        .attr('y', 0 - margin.left + 20)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .attr("value", "avg_rent")
        // .classed("active", true)
        .attr('class', 'active')
        .text("Average Rental Price");

    let avgSale = ylabelsGroup.append('text')
        .attr("transform", "rotate(-90)")  
        .attr('y', 0 - margin.left + 5)
        .attr('x', 0 - (height / 2))
        .attr("dy", "1em")
        .attr('value', "avg_sale_price")
        .attr('class', 'inactive')
        // .classed("inactive", true)
        .text("Average Sale Price");
        
    // updateToolTip function above csv import
    circlesGroup = updateToolTip(someX, someY, circlesGroup, textLabels);
  
    // x axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {
            // get value of selection
            //we are grabbing value out of the above items based on whatever was clicked on
        let value = d3.select(this).attr("value");
        if (value !== someX) {
          // replaces somexAxis with value
          someX = value;      
          console.log(someX)
  
          // updates x scale for new data
          xLinearScale = xScale(allData, someX);
          // console.log(xLinearScale);
          // updates x axis with transition
          xAxis = renderAxesX(xLinearScale, xAxis);
          // console.log(xAxis);
  
          // updates circles with new x values
          circlesGroup = renderCirclesX(circlesGroup, xLinearScale, someX);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(someX, someY, circlesGroup, textLabels);

          textLabels = renderTextX(textLabels, xLinearScale, someX);
        
          // changes classes to change bold text
          if (someX === "Total_Homeless") {
              avgIncome
              .classed("active", false)
              .classed("inactive", true);
              homelessLabel
              .classed("active", true)
              .classed("inactive", false);
          }
          else {
              avgIncome
              .classed("active", true)
              .classed("inactive", false);
              homelessLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        }   
      });
    // y axis labels event listener
    ylabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        //we are grabbing value out of the above items based on whatever was clicked on
        let value = d3.select(this).attr("value");
        if (value !== someY) {
            // replaces someY with value
          someY = value;      
          console.log(someY)
  
          // updates y scale for new data
          yLinearScale = yScale(allData, someY);
  
          // updates y axis with transition
          yAxis = renderAxesY(yLinearScale, yAxis);
  
          // updates circles with new y values
          circlesGroup = renderCirclesY(circlesGroup, yLinearScale, someY);

          textLabels = renderTextY(textLabels, yLinearScale, someY);

          // updates tooltips with new info
          circlesGroup = updateToolTip(someX, someY, circlesGroup, textLabels);        
    
          // changes classes to change bold text
          if (someY === "avg_rent") {
              avgRent
                .classed("active", true)
                .classed("inactive", false);
              avgSale
                .classed("active", false)
                .classed("inactive", true);
          }
          else {
              avgRent
                .classed("active", false)
                .classed("inactive", true);
              avgSale
                .classed("active", true)
                .classed("inactive", false);
          }
        }
      });
  }).catch(function(error) {
      console.log(error);
  });

}
  
  makeResponsive();
  
  d3.select(window).on('resize', makeResponsive);
  