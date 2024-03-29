<script setup lang="ts">

import * as d3 from "d3"
import { onMounted, ref } from "vue";
import { Graph, Model } from "./types";

const props = defineProps({
    graph: { type: Object as () => Graph, required: true }
});

const width = 500;
const height = 500;

const colorMap = ["#ff6666", "#66ff66", "#6666ff", "#ffff66", "#66ffff", "ff66ff"]

const animationDuration = 250;

type GroupSelection = d3.Selection<SVGGElement, unknown, HTMLElement, any>;
var group: GroupSelection;

onMounted(() => {
    // d3.selectAll("#d3-graph-coloring > svg").remove()
    const svg = d3.select("#d3-graph-coloring").insert("svg")
        .attr("height", "100%")
        .attr("width", "100%")
        // .attr("preserveAspectRatio", "none")
        .attr("viewBox", `0 0 ${width} ${height}`);

    group = svg.insert("g")
        .attr("class", "graph");

    updateGraph(props.graph);
});

function updateGraph(data: Graph) {

    const link = group.selectAll("line")
        .data(data.links)
        .join("line")
        .style("stroke", "#888")
        .style("stroke-width", "3");

    const node = group.selectAll(".circle")
        .data(data.nodes)
        .join("g")
        .attr("class", "circle");

    node.append("circle")
        .attr("r", 20)
        .attr("fill", "#ccc")
        .attr("stroke", "#888")
        .attr("stroke-width", "3")

    node.append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("font-size", "20px")
        .attr("font-weight", "bold")
        .attr("fill", "#000")
        .text(function (d: any) { return d.id; });
        

    const ticked = () => {
        link
            .attr("x1", function (d: any) { return d.source.x; })
            .attr("y1", function (d: any) { return d.source.y; })
            .attr("x2", function (d: any) { return d.target.x; })
            .attr("y2", function (d: any) { return d.target.y; });

        node
            .attr("transform", function (d: any) { return `translate(${d.x},${d.y})` })
    }

    const forceLink = d3.forceLink()
        .id(function (d: any) { return d.id; })
        .links(data.links)
        .strength(1);

    const forceNode = d3.forceManyBody()
        .strength(-1000);

    const simulation = d3.forceSimulation(data.nodes as any)
        .force("link", forceLink)
        .force("charge", forceNode)
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    simulation.tick(200);
}

function update(model: Model) {
    let colors: { [key: string]: string } = {};

    for (let literal in model) {
        if (model[literal] === true) {
            let [variable, color] = literal.split("_").map(Number);
            colors[variable] = colorMap[color];
        }
    }

    group.selectAll(".circle > circle")
        .transition()
        .duration(animationDuration)
        .attr("fill", function (d: any) {
            return colors[d.id] ?? "#ccc";
        });
}


defineExpose({ update: update, updateGraph: updateGraph });
</script>

<template>
    <div id="d3-graph-coloring" class="select-none"></div>
</template>

<style lang="css">
#d3-graph-coloring>svg {
    position: absolute;
}
</style>
