<script setup lang="ts">
import * as d3 from "d3"
import { onMounted } from "vue";

var i: number = 0;
onMounted(() => {
    var svg = d3.select("#d3-test").insert("svg")
        .attr("width", "100%")
        .attr("height", "100%")
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
});
</script>


<template>
    <div id="d3-test" class="h-full w-full"></div>
</template>
