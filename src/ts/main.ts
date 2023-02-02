// import { invoke } from "@tauri-apps/api/tauri";
import * as d3 from "d3";

var width: number = 800;
var height: number = 600;

var i: number = 0;

var svg = d3.select("body").insert("svg")
    .attr("width", width)
    .attr("height", height)
    .style("position", "absolute")
    .style("top", "0px")
    .on("mousemove", particle);

function particle(event: Event) {
    event.preventDefault();
    let mouse = d3.pointer(event);
    i = (i + 1) % 360
    svg.insert("circle")
        .attr("cx", mouse[0])
        .attr("cy", mouse[1])
        .attr("r", 1e-6)
        // .style("fill", d3.hsl(i, 1, .5).toString())
        // .style("opacity", 1)
        .style("fill", "transparent")
        .style("stroke", d3.hsl(i, 1, .5).toString())
        .style("stroke-width", 3)
        .transition()
        .duration(2000)
        .ease(Math.sqrt)
        .attr("r", 100)
        .style("opacity", 0)
        // .style("stroke-opacity", 0)
        .remove();
    }
