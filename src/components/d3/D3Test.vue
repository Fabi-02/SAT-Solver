<script setup lang="ts">
import * as d3 from "d3"
import { TreeNode } from "./types";
import { onMounted } from "vue";
import { HierarchyPointNode } from "d3";

var id = 0;

const data: TreeNode = {
    id: id,
    children: []
}

var depth = 1
addChilds(data, depth);

function addChilds(node: TreeNode, depth: number) {
    if (depth <= 0) return;
    let child1 = {
        id: ++id,
        children: []
    };
    let child2 = {
        id: ++id,
        children: []
    };
    addChilds(child1, depth - 1);
    addChilds(child2, depth - 1);
    node.children?.push(child1, child2);
}

type TreeLayoutNode = HierarchyPointNode<TreeNode>;

const width = 700;
const height = 500;

const padding = 20;

const animationDuration = 1000;


type GroupSelection = d3.Selection<SVGGElement, unknown, HTMLElement, any>;
var linkGroup: GroupSelection | null = null
var nodeGroup: GroupSelection | null = null;

onMounted(() => {


    const svg = d3.select("#d3-test").insert("svg")
        .attr("height", "100%")
        .attr("width", "100%")
        // .attr("preserveAspectRatio", "none")
        .attr("viewBox", `0 0 ${width} ${height}`)

    const group = svg.insert("g")
        .attr("class", "tree")

    svg.call(d3.zoom().on("zoom", function (e) {
        group.attr("transform", e.transform)
    }) as any);


    linkGroup = group.insert("g").attr("class", "tree-links");
    nodeGroup = group.insert("g").attr("class", "tree-nodes");

    update();
});

function update() {
    let tree = d3.tree<TreeNode>()
        .size([width - padding * 2, height - padding * 2])
        .separation((a, b) => {
            return a.parent === b.parent ? 1 : 1
        });

    let root = d3.hierarchy<TreeNode>(data);
    let treeData = tree(root);

    treeData.each((node) => {
        node.x += padding;
        node.y += padding;
    });

    let links = treeData.links();

    let linkPathGen = d3.linkVertical<SVGPathElement, TreeLayoutNode>().x(d => d.x).y(d => d.y);
    // const linkPathGen = d3.link<SVGPathElement, TreeLayoutNode>(d3.curveBasis).x(d => d.x).y(d => d.y);

    let linkSelection = linkGroup?.selectAll(".tree-link").data(links)
    linkSelection?.join(
        enter => {
            let linkEnter = enter.append("path").attr("class", "tree-link");

            linkEnter.attr("d", linkPathGen as any)
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
                .attr("d", linkPathGen as any)
                .attr("opacity", 1)
    )

    let nodesSelection = nodeGroup?.selectAll(".tree-node").data(treeData);
    nodesSelection?.join(
        enter => {
            let nodeEnter = enter.append("g").attr("class", "tree-node");

            nodeEnter.append("circle")
                .attr("r", 10)
                .attr("fill", "#666");

            nodeEnter.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", 5)
                .attr("fill", "white")
                .text(d => `${d.data.id}`)

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

            nodeUpdate.select("text").text(d => `${d.data.id}`)

            return nodeUpdate;
        }
    )
}

function test() {
    depth += 1;
    id = 0;
    data.children = []
    addChilds(data, depth);

    // data.children![0].children?.push({
    //     id: ++id,
    //     children: []
    // })
    update();
}
</script>


<template>
    <div id="d3-test">
        <button @click="test">Test</button>
    </div>
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
