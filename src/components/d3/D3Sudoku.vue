<script setup lang="ts">

import * as d3 from "d3"
import { onMounted } from "vue";
import { Model } from "./types";

const N = 3;

const width = 450;
const height = 450;

const padding = 2;

const boardWidth = width - padding * 2;
const boardHeight = height - padding * 2;

const animationDuration = 0;

type GroupSelection = d3.Selection<SVGGElement, unknown, HTMLElement, any>;
var boardGroup: GroupSelection;

onMounted(() => {
    const svg = d3.select("#d3-sudoku").insert("svg")
        .attr("height", "100%")
        .attr("width", "100%")
        // .attr("preserveAspectRatio", "none")
        .attr("viewBox", `0 0 ${width} ${height}`);

    for (let x = 0; x < N; x++) {
        for (let y = 0; y < N; y++) {
            let posX = padding + x * boardWidth / N;
            let posY = padding + y * boardHeight / N;
            svg.append("rect")
                .attr("x", posX)
                .attr("y", posY)
                .attr("width", boardWidth / N)
                .attr("height", boardHeight / N)
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 4);

            for (let sx = 0; sx < N; sx++) {
                for (let sy = 0; sy < N; sy++) {
                    let deltaX = sx * boardWidth / (N * N);
                    let deltaY = sy * boardHeight / (N * N);
                    svg.append("rect")
                        .attr("x", posX + deltaX)
                        .attr("y", posY + deltaY)
                        .attr("width", boardWidth / (N * N))
                        .attr("height", boardHeight / (N * N))
                        .attr("fill", "none")
                        .attr("stroke", "black")
                        .attr("stroke-width", 1);
                }
            }
        }
    }
    

    boardGroup = svg.insert("g")
        .attr("class", "chess-board");
});

function update(model: Model) {
    // let data: {
    //     id: string,
    //     row: number,
    //     col: number,
    //     value: boolean
    // }[] = [];

    // for (let key in model) {
    //     let [row, col] = key.split("_").map(Number);
    //     data.push({
    //         id: key,
    //         row: row,
    //         col: col,
    //         value: model[key]
    //     });
    // }

    // boardGroup.selectAll(".chess-board > .queen")
    //     .data(data)
    //     .join(
    //         enter => {
    //             let queenEnter = enter.append("svg")
    //                 .attr("class", "queen")
    //                 .attr("viewBox", "0 0 512 512")
    //                 .attr("x", d => padding + (d.col - 1 + (1 - queenFactor) / 2) * boardWidth / props.N)
    //                 .attr("y", d => padding + (d.row - 1 + (1 - queenFactor) / 2) * boardHeight / props.N)
    //                 .attr("width", boardWidth / props.N * queenFactor)
    //                 .attr("height", boardHeight / props.N * queenFactor)
    //                 .attr("fill", d => d.value ? "black" : "red")

    //             queenEnter.append("path")
    //                 .attr("d", queenPath)

    //             queenEnter.attr("opacity", 0)
    //                 .transition()
    //                 .duration(animationDuration)
    //                 .attr("opacity", d => d.value ? 1 : 0.2)
    //             return queenEnter;
    //         },
    //         update => update
    //             .transition()
    //             .duration(animationDuration)
    //             .attr("fill", d => d.value ? "black" : "red")
    //             .attr("opacity", d => d.value ? 1 : 0.2)
    //     );
}

defineExpose({ update: update });
</script>

<template>
    <div id="d3-sudoku" class="select-none"></div>
</template>

<style lang="css">
#d3-sudoku > svg {
    position: absolute;
}
</style>
