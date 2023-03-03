<script setup lang="ts">

import * as d3 from "d3"
import { onMounted } from "vue";
import { Model } from "./types";

const props = defineProps({
    N: { type: Number, required: true }
});

const width = 450;
const height = 450;

const padding = 2;

const numberFactor = 0.7;

const boardWidth = width - padding * 2;
const boardHeight = height - padding * 2;

const animationDuration = 250;

type GroupSelection = d3.Selection<SVGGElement, unknown, HTMLElement, any>;
var boardGroup: GroupSelection;

onMounted(() => {
    let NN = props.N * props.N;

    const svg = d3.select("#d3-sudoku").insert("svg")
        .attr("height", "100%")
        .attr("width", "100%")
        // .attr("preserveAspectRatio", "none")
        .attr("viewBox", `0 0 ${width} ${height}`);

    for (let x = 0; x < props.N; x++) {
        for (let y = 0; y < props.N; y++) {
            let posX = padding + x * boardWidth / props.N;
            let posY = padding + y * boardHeight / props.N;
            svg.append("rect")
                .attr("x", posX)
                .attr("y", posY)
                .attr("width", boardWidth / props.N)
                .attr("height", boardHeight / props.N)
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-width", 4);

            for (let sx = 0; sx < props.N; sx++) {
                for (let sy = 0; sy < props.N; sy++) {
                    let deltaX = sx * boardWidth / NN;
                    let deltaY = sy * boardHeight / NN;
                    svg.append("rect")
                        .attr("x", posX + deltaX)
                        .attr("y", posY + deltaY)
                        .attr("width", boardWidth / NN)
                        .attr("height", boardHeight / NN)
                        .attr("fill", "none")
                        .attr("stroke", "black")
                        .attr("stroke-width", 1);
                }
            }
        }
    }
    

    boardGroup = svg.insert("g")
        .attr("class", "sudoku-board");
});

function posFromNumber(number: number): [number, number] {
    number -= 1;
    return [number % props.N, Math.floor(number / props.N)];
}

function update(model: Model) {
    let data: {
        id: string,
        row: number,
        col: number,
        number: number,
        value: boolean
    }[] = [];

    for (let key in model) {
        let [row, col, number] = key.split("_").map(Number);
        data.push({
            id: key,
            row: row,
            col: col,
            number: number,
            value: model[key]
        });
    }

    // boardGroup.selectAll(".sudoku-board > .number")
    //     .data(data)
    //     .join(
    //         enter => {
    //             let numberEnter = enter.append("text")
    //                 .attr("class", "number")
    //                 .attr("x", d => padding + (d.col - 1) * boardWidth / (props.N * props.N))
    //                 .attr("y", d => padding + (d.row - 1) * boardHeight / (props.N * props.N))
    //                 .attr("dx", boardHeight / (props.N * props.N) / 2)
    //                 .attr("dy", boardHeight / (props.N * props.N) / 2)
    //                 .attr("text-anchor", "middle")
    //                 .attr("alignment-baseline", "central")
    //                 .attr("fill", "black")
    //                 .attr("font-size", numberFactor * boardHeight / (props.N * props.N))
    //                 .text(d => d.number);

    //             numberEnter.attr("opacity", 0)
    //                 .transition()
    //                 .duration(animationDuration)
    //                 .attr("opacity", d => d.value ? 1 : 0);

    //             return numberEnter;
    //         },
    //         update => update.transition()
    //             .duration(animationDuration)
    //             .attr("opacity", d => d.value ? 1 : 0)
    //     );

    boardGroup.selectAll(".sudoku-board > .small-number")
        .data(data)
        .join(
            enter => {
                let numberEnter = enter.append("text")
                    .attr("class", "small-number")
                    .attr("x", d => padding + (d.col - 1) * boardWidth / (props.N * props.N))
                    .attr("y", d => padding + (d.row - 1) * boardHeight / (props.N * props.N))
                    .attr("dx", d => boardHeight / (props.N * props.N * props.N) * (posFromNumber(d.number)[0] + 0.5))
                    .attr("dy", d => boardHeight / (props.N * props.N * props.N) * (posFromNumber(d.number)[1] + 0.5))
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "central")
                    .attr("font-size", boardHeight / (props.N * props.N * props.N))
                    .text(d => d.number);

                numberEnter.attr("fill", d => d.value ? "black" : "red")
                    .attr("font-weight", d => d.value ? "bold" : "normal")
                    .attr("opacity", 0)
                    .transition()
                    .duration(animationDuration)
                    .attr("opacity", d => d.value ? 1 : 0.2);

                return numberEnter;
            },
            update => update.transition()
                .duration(animationDuration)
                .attr("opacity", d => d.value ? 1 : 0.2)
                .attr("font-weight", d => d.value ? "bold" : "normal")
                .attr("fill", d => d.value ? "black" : "red")
        );
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
