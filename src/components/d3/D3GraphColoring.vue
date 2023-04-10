<script setup lang="ts">

import * as d3 from "d3"
import { onMounted, ref } from "vue";
import { Model } from "./types";

const nodes = [
    {
        "id": 1,
        "name": "A"
    },
    {
        "id": 2,
        "name": "B"
    },
    {
        "id": 3,
        "name": "C"
    },
    {
        "id": 4,
        "name": "D"
    },
    {
        "id": 5,
        "name": "E"
    },
    {
        "id": 6,
        "name": "F"
    },
    {
        "id": 7,
        "name": "G"
    },
    {
        "id": 8,
        "name": "H"
    },
    {
        "id": 9,
        "name": "I"
    },
    {
        "id": 10,
        "name": "J"
    }
]

const links = [

    {
        "source": 1,
        "target": 2
    },
    {
        "source": 1,
        "target": 5
    },
    {
        "source": 1,
        "target": 6
    },

    {
        "source": 2,
        "target": 3
    },
    {
        "source": 2,
        "target": 7
    }
    ,

    {
        "source": 3,
        "target": 4
    },
    {
        "source": 8,
        "target": 3
    }
    ,
    {
        "source": 4,
        "target": 5
    }
    ,

    {
        "source": 4,
        "target": 9
    },
    {
        "source": 5,
        "target": 10
    }
]

const width = 450;
const height = 450;

const padding = 0;

const queenFactor = 0.7;

const boardWidth = width - padding * 2;
const boardHeight = height - padding * 2;

const animationDuration = 0;

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

    update(null as any); // temp
});

function update(model: Model) {
    const link = group.selectAll("line")
        .data(links)
        .join("line")
        .style("stroke", "#888")
        .style("stroke-width", "3");

    const node = group.selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 20)
        .attr("fill", "#ccc");

    const ticked = () => {
        link
            .attr("x1", function (d: any) { return d.source.x; })
            .attr("y1", function (d: any) { return d.source.y; })
            .attr("x2", function (d: any) { return d.target.x; })
            .attr("y2", function (d: any) { return d.target.y; });

        node
            .attr("cx", function (d: any) { return d.x; })
            .attr("cy", function (d: any) { return d.y; });
    }

    const simulation = d3.forceSimulation(nodes as any)
        .force("link", d3.forceLink()
            .id(function (d: any) { return d.id; })
            .links(links)
            .strength(1)
        )
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .on("tick", ticked);

}


defineExpose({ update: update });
</script>

<template>
    <div id="d3-graph-coloring" class="select-none"></div>
</template>

<style lang="css">
#d3-graph-coloring>svg {
    position: absolute;
}
</style>
