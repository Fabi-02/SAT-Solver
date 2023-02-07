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

addChilds(data, 5);

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

onMounted(() => {

    const width = 700;
    const height = 500;

    const padding = 20;

    const svg = d3.select("#d3-test").insert("svg")
        .attr("height", "100%")
        .attr("width", "100%")
        // .attr("preserveAspectRatio", "none")
        .attr("viewBox", `0 0 ${width} ${height}`);

    const linkGroup = svg.insert("g").attr('class', 'tree-links');
    const nodeGroup = svg.insert("g").attr('class', 'tree-nodes');

    const tree = d3.tree<TreeNode>()
        .size([width - padding * 2, height - padding * 2])
        .separation((a, b) => {
            return a.parent === b.parent ? 1 : 1
        });

    const root = d3.hierarchy<TreeNode>(data);
    const treeData = tree(root);

    treeData.each((node) => {
        node.x += padding;
        node.y += padding;
    });

    const links = treeData.links();

    const linkPathGen = d3.linkVertical<SVGPathElement, TreeLayoutNode>().x(d => d.x).y(d => d.y);
    // const linkPathGen = d3.link<SVGPathElement, TreeLayoutNode>(d3.curveBasis).x(d => d.x).y(d => d.y);

    linkGroup.selectAll('path').data(links).enter()
        .append('path').attr('d', linkPathGen as any);

    const nodesEnter = nodeGroup.selectAll('g').data(treeData).enter()
        .append("g")
        .attr("class", "tree-node")
        .attr("transform", (d) => `translate(${d.x},${d.y})`)

    nodesEnter.append('circle')
        .attr("r", 10)
        .attr("fill", "#666");

    nodesEnter.append('text')
        .attr("text-anchor", "middle")
        .attr("dy", 5)
        .attr("fill", "white")
        .text((d) => `${d.data.id}`)

});
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

#d3-test > svg {
    position: absolute;
}
</style>
