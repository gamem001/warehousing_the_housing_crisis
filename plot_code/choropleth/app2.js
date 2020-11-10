chart = {
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, 975, 610]);
  
    svg.append("g")
        .attr("transform", "translate(610,20)")
        .append(() => legend({color, title: data.title, width: 260}));
  
    svg.append("g")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .join("path")
        .attr("fill", d => color(data.get(d.id)))
        .attr("d", path)
      .append("title")
        .text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}
  ${format(data.get(d.id))}`);
  
    svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);
  
    return svg.node();
  }
  
    data = Object.assign(new Map(d3.csvParse(await FileAttachment("unemployment-x.csv").text(), ({id, rate}) => [id, +rate])), {title: "Unemployment rate (%)"})

    color = d3.scaleQuantize([1, 10], d3.schemeBlues[9])

    path = d3.geoPath()

    format = d => `${d}%`

    states = new Map(us.objects.states.geometries.map(d => [d.id, d.properties]))

    us = FileAttachment("counties-albers-10m.json").json()

    topojson = require("topojson-client@3")

    d3 = require("d3@6")

    import {legend} from "@d3/color-legend"