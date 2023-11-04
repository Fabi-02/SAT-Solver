<script setup lang="ts">

import * as d3 from "d3"
import { onMounted, ref } from "vue";
import { Graph, InteractionGraph, Model } from "./types";

const width = 500;
const height = 500;

const animationDuration = 250;

type GroupSelection = d3.Selection<SVGGElement, unknown, HTMLElement, any>;
var group: GroupSelection;

const family = [
    { literal: "MD", name: "Mr. Dupont", x: -120, y: -100 },
    { literal: "FD", name: "Mrs. Dupont", x: 120, y: -100 },
    { literal: "I", name: "Ivana", x: -200, y: 50 },
    { literal: "G", name: "Georg", x: 0, y: 100 },
    { literal: "E", name: "Emma", x: 200, y: 50 },
]

onMounted(() => {
    const svg = d3.select("#d3-dinner").insert("svg")
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("viewBox", `-${width/2} -${height/2} ${width} ${height}`);

    group = svg.insert("g")
        .attr("class", "graph");

    group.selectAll(".circle").remove();
    group.selectAll("line").remove();

    const node = group.selectAll(".circle")
        .data(family)
        .join("g")
        .attr("class", "circle")
        .attr("transform", function (d: any) { return `translate(${d.x},${d.y})` })

    node.append("circle")
        .attr("r", 30)
        .attr("fill", "#ccc")
        .attr("stroke", "#888")
        .attr("stroke-width", "5")

    node.append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("font-size", "25px")
        .attr("font-weight", "bold")
        .attr("fill", "#000")
        .text(function (d: any) { return d.literal; });

    node.append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("font-size", "30px")
        .attr("font-weight", "bold")
        .attr("fill", "#000")
        .attr("y", "50")
        .text(function (d: any) { return d.name; });
});

function update(model: Model) {
    group.selectAll(".circle > circle")
        .transition()
        .duration(animationDuration)
        .attr("fill", function (d: any) {
            return d.literal in model ? model[d.literal] === true ? "#6D6" : "#D66" : "#ccc";
        });
}
defineExpose({ update: update });
</script>

<template>
    <div id="d3-dinner" class="select-none"></div>
</template>

<style lang="css">
#d3-dinner > svg {
    position: absolute;
}
</style>
