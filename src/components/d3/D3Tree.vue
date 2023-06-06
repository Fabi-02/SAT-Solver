<script setup lang="ts">

import * as d3 from "d3"
import { Eval, Model, TreeNode } from "./types";
import { onMounted } from "vue";
import { HierarchyLink, HierarchyPointNode } from "d3";
import { showModal } from "@ts/modal";
import { CNF } from "@ts/formula";

const props = defineProps({
    nodeSizeX: { type: Number, default: 60 },
    nodeSizeY: { type: Number, default: 60 },
    formula: { type: String, required: true }
});

type TreeLayoutNode = HierarchyPointNode<TreeNode>;
type TreeLayoutLink = HierarchyLink<TreeNode>;

const width = 700;
const height = 500;

const padding = 20;

const animationDuration = 500;


type GroupSelection = d3.Selection<SVGGElement, unknown, HTMLElement, any>;
var linkGroup: GroupSelection;
var nodeGroup: GroupSelection;

var zoom: d3.ZoomBehavior<Element, unknown>;
var mouseover: (event: MouseEvent, d: TreeLayoutNode) => void;
var mousemove: (event: MouseEvent) => void;
var mouseleave: (event: MouseEvent) => void;

onMounted(() => {
    const svg = d3.select("#d3-tree").insert("svg")
        .attr("height", "100%")
        .attr("width", "100%")
        // .attr("preserveAspectRatio", "none")
        .attr("viewBox", `${-width / 2} 0 ${width} ${height}`);

    const tooltip = d3.select("#d3-tree").append("div")
        .style("visibility", "hidden")
        .attr("class", "tooltip border border-gray-500 p-2 rounded-md")
        .style("background-color", "rgba(248, 248, 248, .8)")
        .style("position", "fixed");

    mouseover = (event: MouseEvent, d: TreeLayoutNode) => {
        if (d.data.name === "") return;
        let result = "";
        switch(d.data.result) {
            case "sat": 
                result = "<span class=\"text-green-600\">SAT</span>";
                break;
            case "unsat":
                result = "<span class=\"text-red-600\">UNSAT</span>";
                break;
            case "unknown":
                result = "<span class=\"text-gray-500\">UNKNOWN</span>";
                break;
        }
        let htmlData = {
            "Literal": `"${d.data.key}"`, 
            "Wert": d.data.neg ? "<span class=\"text-red-600\">False</span>" : "<span class=\"text-green-600\">True</span>", 
            "Ergebnis": result,
        };
        let html = "";
        for (let [key, value] of Object.entries(htmlData)) {
            html += `${key} <span class="text-gray-500">:</span> ${value}<br>`;
        }
        tooltip.html(html)
            .style("visibility", "visible");
    };

    mousemove = (event: MouseEvent) => {
        tooltip.style("left", `${event.pageX + 20}px`)
            .style("top", `${event.pageY - 20}px`);
            // .style("left", `calc(${(event.pageX + 10)}px - 200%)`)
            // .style("top", `calc(${(event.pageY + 10)}px - 200%)`)
    };

    mouseleave = (event: MouseEvent) => {
        tooltip
            .style("visibility", "hidden");
    };

    const group = svg.insert("g")
        .attr("class", "tree");

    zoom = d3.zoom().on("zoom", function (e) {
        if (e.sourceEvent !== null) {
            mousemove(e.sourceEvent as MouseEvent);
        }
        group.attr("transform", e.transform);
    });

    svg.call(zoom as any);

    // svg.call(zoom!.translateTo as any, 0, height / 2);


    linkGroup = group.insert("g").attr("class", "tree-links");
    nodeGroup = group.insert("g").attr("class", "tree-nodes");

    update({
        id: 0,
        pathId: 0,
        name: "",
        key: "",
        neg: false,
        result: "unknown",
        heuristic: false,
        sat_path: false,
        children: []
    }, 0);
});

function update(data: TreeNode, pathId: number, panToId: number | null = null) {
 
    let tree = d3.tree<TreeNode>()
        .nodeSize([props.nodeSizeX, props.nodeSizeY])
        // .size([width - padding * 2, height - padding * 2])
        .separation((a, b) => {
            return a.parent === b.parent ? 1 : 1
        });

    let root = d3.hierarchy<TreeNode>(data);
    let treeData = tree(root);

    treeData.each((node) => {
        // node.x += padding;
        node.y += padding;

        if (panToId !== null) {
            if (node.data.id == panToId) {
                d3.select('#d3-tree > svg')
                    .transition()
                    .duration(animationDuration / 2)
                    .call(zoom!.translateTo as any, node.x, node.y);
            }
        }
    });


    let links = treeData.links();

    let linkPathGen = d3.linkVertical<SVGPathElement, TreeLayoutNode>().x(d => d.x).y(d => d.y);
    // const linkPathGen = d3.link<SVGPathElement, TreeLayoutNode>(d3.curveBasis).x(d => d.x).y(d => d.y);

    const linkClass = (d: TreeLayoutLink) => {
        let classes = "tree-link";
        if (d.target.data.pathId == pathId) {
            classes += " path-link";
        }
        if (d.target.data.heuristic) {
            classes += " heuristic-link";
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
            
            nodeEnter.on("mouseover", mouseover! as any)
                .on("mousemove", mousemove! as any)
                .on("mouseleave", mouseleave! as any);

            nodeEnter.on("click", (event: MouseEvent, d: TreeLayoutNode) => {
                if (d.data.name === "" || props.formula === undefined) return;
                let model: Model = {};
                let node: TreeLayoutNode | null = d;
                do {
                    model[node.data.key] = !node.data.neg;
                } while((node = node.parent) !== null && node.data.name !== "");
                let cnf = new CNF(props.formula);
                showModal("FormulaModel", { formula: cnf, model: model });
            });

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

function resetZoom() {
    d3.select('#d3-tree > svg')
        .transition()
        .duration(animationDuration / 2)
        .call(zoom!.transform as any, d3.zoomIdentity);
}

defineExpose({ update: update });
</script>


<template>
    <div id="d3-tree" class="select-none"></div>
    <font-awesome-icon icon="fa-solid fa-location-crosshairs" class="absolute left-3 top-3 text-gray-500 text-2xl cursor-pointer" @click="resetZoom" />
</template>


<style lang="css">
.tree-node {
    cursor: pointer;
}

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

.heuristic-link {
    stroke-dasharray: 10, 5;
}

#d3-tree > svg {
    @apply rounded-xl border-4 border-gray-200;
    position: absolute;
}
</style>
