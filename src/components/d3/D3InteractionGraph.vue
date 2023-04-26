<script setup lang="ts">

import * as d3 from "d3"
import { onMounted, ref } from "vue";
import { Graph, InteractionGraph, Model } from "./types";

const props = defineProps({
    graph: { type: Object as () => InteractionGraph, required: true }
});

const width = 500;
const height = 500;

const animationDuration = 250;

type GroupSelection = d3.Selection<SVGGElement, unknown, HTMLElement, any>;
var group: GroupSelection;

var zoom: d3.ZoomBehavior<Element, unknown>;

onMounted(() => {
    // d3.selectAll("#d3-interaction-graph > svg").remove()
    const svg = d3.select("#d3-interaction-graph").insert("svg")
        .attr("height", "100%")
        .attr("width", "100%")
        // .attr("preserveAspectRatio", "none")
        .attr("viewBox", `0 0 ${width} ${height}`);

    group = svg.insert("g")
        .attr("class", "graph");

    zoom = d3.zoom().on("zoom", function (e) {
        group.attr("transform", e.transform);
    });

    svg.call(zoom as any);

    updateGraph(props.graph);
});

function updateGraph(data: InteractionGraph) {
    group.selectAll(".circle").remove();
    group.selectAll("line").remove();

    const link = group.selectAll("line")
        .data(data.links)
        .join("line")
        .style("stroke", "#888")
        .style("stroke-width", "1");

    const node = group.selectAll(".circle")
        .data(data.nodes)
        .join("g")
        .attr("class", "circle");

    node.append("circle")
        .attr("r", 5)
        .attr("fill", "#ccc")
        .attr("stroke", "#888")
        .attr("stroke-width", "1")

    node.append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .attr("font-size", "5px")
        .attr("font-weight", "bold")
        .attr("fill", "#000")
        .text(function (d: any) { return d.literal; });


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
        .links(data.links);

    const forceNode = d3.forceManyBody();

    const simulation = d3.forceSimulation(data.nodes as any)
        .force("link", forceLink)
        .force("charge", forceNode)
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

    // simulation.tick(200);

    // setTimeout(() => {
    //     simulation.stop();
    // }, 0);
}

function update(model: Model) {
    group.selectAll(".circle > circle")
        .transition()
        .duration(animationDuration)
        .attr("fill", function (d: any) {
            return d.literal in model ? model[d.literal] === true ? "#6D6" : "#D66" : "#ccc";
        });
}

function resetZoom() {
    d3.select('#d3-interaction-graph > svg')
        .transition()
        .duration(animationDuration / 2)
        .call(zoom!.transform as any, d3.zoomIdentity);
}

defineExpose({ update: update, updateGraph: updateGraph });
</script>

<template>
    <div id="d3-interaction-graph" class="select-none"></div>
    <font-awesome-icon icon="fa-solid fa-location-crosshairs"
        class="absolute left-3 top-3 text-gray-500 text-2xl cursor-pointer" @click="resetZoom" />
</template>

<style lang="css">
#d3-interaction-graph>svg {
    @apply rounded-xl border-4 border-gray-200;
    position: absolute;
}
</style>
