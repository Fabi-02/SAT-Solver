<script setup lang="ts">

import * as d3 from "d3"
import { TreeNode } from "./types";
import { onMounted } from "vue";
import { HierarchyLink, HierarchyPointNode } from "d3";
import { Eval } from "@/ts/formula";

type TreeLayoutNode = HierarchyPointNode<TreeNode>;
type TreeLayoutLink = HierarchyLink<TreeNode>;

const width = 700;
const height = 500;

const padding = 20;

const animationDuration = 500;


type GroupSelection = d3.Selection<SVGGElement, unknown, HTMLElement, any>;
var linkGroup: GroupSelection | null = null;
var nodeGroup: GroupSelection | null = null;

onMounted(() => {
    const svg = d3.select("#d3-test").insert("svg")
        .attr("height", "100%")
        .attr("width", "100%")
        // .attr("preserveAspectRatio", "none")
        .attr("viewBox", `0 0 ${width} ${height}`);

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
        name: "",
        key: "",
        neg: false,
        result: "unknown",
        unit_prop: false,
        sat_path: false,
        children: []
    }, 0);
});

function update(data: TreeNode, pathId: number) {
    let tree = d3.tree<TreeNode>()
        .nodeSize([60, 60])
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

    const linkClass = (d: TreeLayoutLink) => {
        let classes = "tree-link";
        if (d.target.data.pathId == pathId) {
            classes += " path-link";
        }
        if (d.target.data.unit_prop) {
            classes += " unit-prop-link";
        }
        if (d.target.data.sat_path) {
            classes += " sat-path-link";
        }
        return classes;
    }

    let linkSelection = linkGroup?.selectAll(".tree-link").data(links, (d) => (d as TreeLayoutLink).target.data.id)
    linkSelection?.join(
        enter => {
            let linkEnter = enter.append("path")
                .attr("class", linkClass)

            linkEnter.attr("d", d => {
                let copy: TreeLayoutLink = Object.create(d);
                copy.target = copy.source; 
                return linkPathGen(copy as any);
            })
                .attr("opacity", 0)
                .transition()
                .delay(animationDuration / 2)
                .attr("opacity", 1)
                .duration(animationDuration / 2)
                .attr("d", linkPathGen as any)

            return linkEnter;
        },
        update =>
            update.attr("class", linkClass)
                .transition()
                .attr("opacity", 1)
                .duration(animationDuration / 2)
                .attr("d", linkPathGen as any)

    )

    const nodeFill = (d: TreeLayoutNode) => {
        switch (d.data.result as Eval) {
            case "sat":
                return "#6D6";
            case "unsat":
                return "#D66";
            case "unknown":
                return "#AAA";
        }
    };

    let nodesSelection = nodeGroup?.selectAll(".tree-node").data(treeData, (d) => (d as TreeLayoutNode).data.id);
    nodesSelection?.join(
        enter => {
            let nodeEnter = enter.append("g").attr("class", "tree-node");

            nodeEnter.append("circle")
                .attr("r", (d) => (d as TreeLayoutNode).data.result === "unknown" ? 4 : 6)
                .attr("fill", nodeFill)

            nodeEnter.append("text")
                .attr("text-anchor", "right")
                .attr("dy", 5)
                .attr("dx", 8)
                .attr("fill", (d) => (d as TreeLayoutNode).data.neg ? "#A44" : "#4A4")
                .text(d => `${d.data.name}`);

            nodeEnter.filter(d => d.data.result !== "unknown").append("text")
                .attr("text-anchor", "middle")
                .attr("dy", 30)
                .attr("font-weight", "bold")
                .attr("fill", (d) => (d as TreeLayoutNode).data.result === "unsat" ? "#A44" : "#4A4")
                .text(d => `${d.data.result.toUpperCase()}`);

            nodeEnter
                .attr("opacity", 0)
                .attr("transform", d => `translate(${d.parent?.x || d.x},${d.parent?.y || d.y})`)
                .transition()
                .delay(animationDuration / 2)
                .attr("opacity", 1)
                .duration(animationDuration / 2)
                .attr("transform", d => `translate(${d.x},${d.y})`);

            return nodeEnter;
        },
        update => {
            let nodeUpdate = update.transition()
                .duration(animationDuration / 2)
                .attr("transform", d => `translate(${d.x},${d.y})`)
                .attr("opacity", 1);

            nodeUpdate.select("circle")
                // .attr("stroke", (d) => (d as any).data.pathId == pathId ? "#0AF" : "black")
                .attr("fill", nodeFill);

            nodeUpdate.select("text").text(d => `${d.data.name}`)

            return nodeUpdate;
        }
    )
}

defineExpose({ update: update });
</script>


<template><div id="d3-test"></div></template>


<style lang="css">
.tree-links {
    fill: none;
    stroke: #AAA;
    stroke-width: 1;
}

.sat-path-link {
    stroke: #6D6;
    stroke-width: 2;
}

.path-link {
    stroke: #0AF;
    stroke-width: 2;
}

.unit-prop-link {
    stroke-dasharray: 10, 5;
}

#d3-test>svg {
    position: absolute;
}
</style>
