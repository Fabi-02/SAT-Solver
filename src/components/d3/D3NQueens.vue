<script setup lang="ts">

import * as d3 from "d3"
import { nextTick, onMounted } from "vue";
import { Model } from "./types";

const props = defineProps({
    N: { type: Number, required: true }
});

const width = 450;
const height = 450;

const padding = 0;

const boardWidth = width - padding * 2;
const boardHeight = height - padding * 2;

type GroupSelection = d3.Selection<SVGGElement, unknown, HTMLElement, any>;
var boardGroup: GroupSelection;

onMounted(() => {
    const svg = d3.select("#d3-nqueens").insert("svg")
        .attr("height", "100%")
        .attr("width", "100%")
        // .attr("preserveAspectRatio", "none")
        .attr("viewBox", `0 0 ${width} ${height}`);

    for (let w = 0; w < props.N; w++) {
        for (let h = 0; h < props.N; h++) {
            svg.append("rect")
                .attr("x", padding + w * boardWidth / props.N)
                .attr("y", padding + h * boardHeight / props.N)
                .attr("width", boardWidth / props.N)
                .attr("height", boardHeight / props.N)
                .attr("fill", (w + h) % 2 == 0 ? "#E3C16F" : "#B88B4A")
                // .attr("stroke", "black")
                // .attr("stroke-width", 3);
        }
    }

    boardGroup = svg.insert("g")
        .attr("class", "chess-board");
});

function update(model: Model) {
    let data: {
        id: string,
        row: number,
        col: number,
        value: boolean
    }[] = [];

    for (let key in model) {
        let [row, col] = key.split("_").map(Number);
        data.push({
            id: key,
            row: row,
            col: col,
            value: model[key]
        });
    }

    boardGroup.selectAll(".chess-board > .queen")
        .data(data)
        .join(
            enter => enter.append("circle")
                .attr("class", "queen")
                .attr("cx", d => padding + (d.col - 0.5) * boardWidth / props.N)
                .attr("cy", d => padding + (d.row - 0.5) * boardHeight / props.N)
                .attr("r", boardWidth / props.N / 4)
                .attr("fill", d => d.value ? "green" : "red"),
            update => update
                .attr("fill", d => d.value ? "green" : "red")
        );
}

defineExpose({ update: update });
</script>

<template>
    <div id="d3-nqueens" class="select-none"></div>
</template>

<style lang="css">
#d3-nqueens > svg {
    position: absolute;
}
</style>
