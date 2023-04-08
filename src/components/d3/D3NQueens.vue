<script setup lang="ts">

import * as d3 from "d3"
import { onMounted, ref } from "vue";
import { Model } from "./types";

const props = defineProps({
    N: { type: Number, required: true }
});

// https://fontawesome.com/icons/chess-queen?s=solid&f=classic
const queenPath = "M255 0a56 56 0 1 1 0 112A56 56 0 1 1 255 0zM133.1 143.8c3.3-13 15-23.8 30.2-23.8c12.3 0 22.6 7.2 27.7 17c12 23.2 36.2 39 64 39s52-15.8 64-39c5.1-9.8 15.4-17 27.7-17c15.3 0 27 10.8 30.2 23.8c7 27.8 32.2 48.3 62.1 48.3c10.8 0 21-2.7 29.8-7.4c8.4-4.4 18.9-4.5 27.6 .9c13 8 17.1 25 9.2 38L398.7 400H383 342.6 167.4 127 111.3L4.4 223.6c-7.9-13-3.8-30 9.2-38c8.7-5.3 19.2-5.3 27.6-.9c8.9 4.7 19 7.4 29.8 7.4c29.9 0 55.1-20.5 62.1-48.3zM255 224l0 0 0 0h0zM111 432H399l41.4 41.4c4.2 4.2 6.6 10 6.6 16c0 12.5-10.1 22.6-22.6 22.6H85.6C73.1 512 63 501.9 63 489.4c0-6 2.4-11.8 6.6-16L111 432z";

const width = 450;
const height = 450;

const padding = 0;

const queenFactor = 0.7;

const boardWidth = width - padding * 2;
const boardHeight = height - padding * 2;

const animationDuration = 0;

type GroupSelection = d3.Selection<SVGGElement, unknown, HTMLElement, any>;
var boardGroup: GroupSelection;

onMounted(() => {
    updateN();
});

function updateN() {
    d3.selectAll("#d3-nqueens > svg").remove()
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
};

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
            enter => {
                let queenEnter = enter.append("svg")
                    .attr("class", "queen")
                    .attr("viewBox", "0 0 512 512")
                    .attr("x", d => padding + (d.col - 1 + (1 - queenFactor) / 2) * boardWidth / props.N)
                    .attr("y", d => padding + (d.row - 1 + (1 - queenFactor) / 2) * boardHeight / props.N)
                    .attr("width", boardWidth / props.N * queenFactor)
                    .attr("height", boardHeight / props.N * queenFactor)
                    .attr("fill", d => d.value ? "black" : "red")

                queenEnter.append("path")
                    .attr("d", queenPath)

                queenEnter.attr("opacity", 0)
                    .transition()
                    .duration(animationDuration)
                    .attr("opacity", d => d.value ? 1 : 0.2)
                return queenEnter;
            },
            update => update
                .transition()
                .duration(animationDuration)
                .attr("fill", d => d.value ? "black" : "red")
                .attr("opacity", d => d.value ? 1 : 0.2)
        );
}

defineExpose({ update: update, updateN: updateN });
</script>

<template>
    <div id="d3-nqueens" class="select-none"></div>
</template>

<style lang="css">
#d3-nqueens > svg {
    position: absolute;
}
</style>
