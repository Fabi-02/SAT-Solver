<script setup lang="ts">
import * as d3 from "d3"
import { onMounted } from "vue";

const data = {
    data: {
        id: 0
    },
    children: [
        {
            data: {
                id: 0
            },
            children: [
                {
                    data: {
                        id: 0
                    }
                },
                {
                    data: {
                        id: 0
                    },
                    children: [
                    {
                        data: {
                            id: 0
                        }
                    },
                    {
                        data: {
                            id: 0
                        }
                    }
                ]
                }
            ]
        },
        {
            data: {
                id: 0
            }
        }
    ]
}

onMounted(() => {

    const width = 400;
    const height = 400;

    const svg = d3.select("#d3-test").insert("svg")
        .attr("width", width)
        .attr("height", height);

    const treeLayout = d3.tree().nodeSize([height / 5, width / 5]);

    const root: any = d3.hierarchy(data);
    const links = treeLayout(root).links();
    const linkPathGen: any = d3.linkVertical().x(d => (d as any).x + width / 2).y(d => (d as any).y);

    svg.selectAll('path').data(links).enter()
        .append('path').attr('d', linkPathGen).attr('class', 'tree-link');
});
</script>


<template>
    <div id="d3-test" class="h-full w-full"></div>
</template>


<style lang="css">
.tree-link {
    fill: none;
    stroke: black;
}
</style>
