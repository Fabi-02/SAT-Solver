<script setup lang="ts">
import * as d3 from "d3"
import { TreeNode } from "./types";
import { onMounted } from "vue";
import { HierarchyPointLink, HierarchyPointNode, Link, ValueFn } from "d3";

var id = 0;

const data: TreeNode = {
    id: id,
    children: []
}

addChilds(data, 3);

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

    const width = 500;
    const height = 500;

    const svg = d3.select("#d3-test").insert("svg")
        .attr("height", "100%")
        .attr("width", "100%")
        .attr("preserveAspectRatio", "none")
        .attr("viewBox", `0 0 ${width} ${height}`);
    
    const tree = d3.tree<TreeNode>().size([width, height]);

    const root = d3.hierarchy<TreeNode>(data);
    const links = tree(root).links();
    const linkPathGen: any = d3.linkVertical<TreeLayoutNode, TreeLayoutNode>().x(d => d.x).y(d => d.y);

    svg.selectAll('path').data(links).enter()
        .append('path').attr('d', linkPathGen).attr('class', 'tree-link');
});
</script>


<template>
    <div id="d3-test"></div>
</template>


<style lang="css">
.tree-link {
    fill: none;
    stroke: black;
}
</style>
