// https://observablehq.com/@d3/zoom-with-tooltip@156
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Zoom with Tooltip

If the zoom behavior is applied to the container of interactive elements (and not an overlay!), you can zoom and interact concurrently: mouse and touch events will bubble up from the elements to the zoomable container.`
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","data","radius"], function(d3,width,height,data,radius)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  const g = svg.append("g")
      .attr("class", "circles");

  g.append("style").text(`
    .circles {
      stroke: transparent;
      stroke-width: 1.5px;
    }
    .circles circle:hover {
      stroke: black;
    }
`);

  g.selectAll("circle")
    .data(data)
    .join("circle")
      .datum(([x, y], i) => [x, y, i])
      .attr("cx", ([x]) => x)
      .attr("cy", ([, y]) => y)
      .attr("r", radius)
      .attr("fill", ([,, i]) => d3.interpolateRainbow(i / 360))
      .on("mousedown", mousedowned)
    .append("title")
      .text((d, i) => `circle ${i}`);

  svg.call(d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([1, 8])
      .on("zoom", zoomed));

  function mousedowned(event, [,, i]) {
    d3.select(this).transition()
        .attr("fill", "black")
        .attr("r", radius * 2)
      .transition()
        .attr("fill", d3.interpolateRainbow(i / 360))
        .attr("r", radius);
  }

  function zoomed({transform}) {
    g.attr("transform", transform);
  }

  return svg.node();
}
);
  main.variable(observer("height")).define("height", function(){return(
500
)});
  main.variable(observer("radius")).define("radius", function(){return(
6
)});
  main.variable(observer("step")).define("step", ["radius"], function(radius){return(
radius * 2
)});
  main.variable(observer("data")).define("data", ["step","theta","width","height"], function(step,theta,width,height){return(
Array.from({length: 2000}, (_, i) => {
  const radius = step * Math.sqrt(i += 0.5), a = theta * i;
  return [
    width / 2 + radius * Math.cos(a),
    height / 2 + radius * Math.sin(a)
  ];
})
)});
  main.variable(observer("theta")).define("theta", function(){return(
Math.PI * (3 - Math.sqrt(5))
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3-selection@2", "d3-zoom@2", "d3-scale-chromatic@2")
)});
  return main;
}
