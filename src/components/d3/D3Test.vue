<script setup lang="ts">
import * as d3 from "d3"
import { TreeNode } from "./types";
import { onMounted } from "vue";
import { HierarchyPointNode } from "d3";
import { Eval } from "@/ts/formula";

type TreeLayoutNode = HierarchyPointNode<TreeNode>;

const width = 700;
const height = 500;

const padding = 20;

const animationDuration = 1000;


type GroupSelection = d3.Selection<SVGGElement, unknown, HTMLElement, any>;
var linkGroup: GroupSelection | null = null;
var nodeGroup: GroupSelection | null = null;

onMounted(() => {
    const svg = d3.select("#d3-test").insert("svg")
        .attr("height", "100%")
        .attr("width", "100%")
        // .attr("preserveAspectRatio", "none")
        .attr("viewBox", `0 0 ${width} ${height}`)

    const group = svg.insert("g")
        .attr("class", "tree");

    svg.call(d3.zoom().on("zoom", function (e) {
        group.attr("transform", e.transform)
    }) as any);


    linkGroup = group.insert("g").attr("class", "tree-links");
    nodeGroup = group.insert("g").attr("class", "tree-nodes");

    update({
        id: 0,
        pathId: 0,
        result: "unknown",
        name: "",
        children: []
    }, 0);
});

function update(data: TreeNode, pathId: number) {
    let tree = d3.tree<TreeNode>()
        .nodeSize([50, 50])
        // .size([width - padding * 2, height - padding * 2])
        .separation((a, b) => {
            return a.parent === b.parent ? 1 : 1
        });

    let root = d3.hierarchy<TreeNode>(data);
    let treeData = tree(root);

    treeData.each((node) => {
        // node.x += padding;
        node.x += width / 2;
        node.y += padding;
    });
    
    
    let links = treeData.links();
    
    let linkPathGen = d3.linkVertical<SVGPathElement, TreeLayoutNode>().x(d => d.x).y(d => d.y);
    // const linkPathGen = d3.link<SVGPathElement, TreeLayoutNode>(d3.curveBasis).x(d => d.x).y(d => d.y);

    let linkSelection = linkGroup?.selectAll(".tree-link").data(links, (d) => (d as any).target.data.id)
    linkSelection?.join(
        enter => {
            let linkEnter = enter.append("path").attr("class", "tree-link");

            linkEnter.attr("d", linkPathGen as any)
                .attr("stroke", (d) => (d as any).target.data.pathId == pathId ? "#0AF" : "#AAA")
                .attr("stroke-width", (d) => (d as any).target.data.pathId == pathId ? "2" : "1")
                .attr("opacity", 0)
                .transition()
                .delay(animationDuration / 2)
                .duration(animationDuration / 2)
                .attr("opacity", 1);

            return linkEnter;
        },
        update =>
            update.transition()
                .duration(animationDuration / 2)
                .attr("stroke", (d) => (d as any).target.data.pathId == pathId ? "#0AF" : "#AAA")
                .attr("stroke-width", (d) => (d as any).target.data.pathId == pathId ? "2" : "1")
                .attr("d", linkPathGen as any)
                .attr("opacity", 1)
    )

    let nodesSelection = nodeGroup?.selectAll(".tree-node").data(treeData, (d) => (d as any).data.id);
    nodesSelection?.join(
        enter => {
            let nodeEnter = enter.append("g").attr("class", "tree-node");

            nodeEnter.append("circle")
                .attr("r", 6)
                // .attr("fill", "white")
                // .attr("stroke", (d) => (d as any).data.pathId == pathId ? "#0AF" : "black")
                // .attr("stroke-width", "3")
                .attr("fill", (d) => {
                    switch ((d as any).data.result as Eval) {
                        case "sat":
                            return "#6D6"
                        case "unsat":
                            return "#D66"
                        case "unknown":
                            return "#AAA"
                    }
                });

            nodeEnter.append("text")
                .attr("text-anchor", "right")
                .attr("dy", 5)
                .attr("dx", 15)
                .attr("fill", "black")
                .text(d => `${d.data.name}`);

            nodeEnter.attr("transform", d => `translate(${d.x},${d.y})`)
                .attr("opacity", 0)
                .transition()
                .delay(animationDuration / 2)
                .duration(animationDuration / 2)
                .attr("opacity", 1);

            return nodeEnter;
        },
        update => {
            let nodeUpdate = update.transition()
                .duration(animationDuration / 2)
                .attr("transform", (d) => `translate(${d.x},${d.y})`)
                .attr("opacity", 1);

            nodeUpdate.select("circle")
                // .attr("stroke", (d) => (d as any).data.pathId == pathId ? "#0AF" : "black")
                .attr("fill", (d) => {
                    switch ((d as any).data.result as Eval) {
                        case "sat":
                            return "#6D6"
                        case "unsat":
                            return "#D66"
                        case "unknown":
                            return "#AAA"
                    }
                });

            nodeUpdate.select("text").text(d => `${d.data.name}`)

            return nodeUpdate;
        }
    )
}

defineExpose({ update: update });
</script>


<template>
    <div id="d3-test"></div>
</template>


<style lang="css">
.tree-links {
    fill: none;
    stroke: black;
    /* stroke-width: 0.1px; */
}

#d3-test>svg {
    position: absolute;
}
</style>
