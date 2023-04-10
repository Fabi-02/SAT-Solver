import { Graph } from "@components/d3/types";

export function stringToGraph(input: string): Graph {
    let nodes: { id: number }[] = [];
    let links: { source: number, target: number }[] = [];

    input.split("\n").forEach(line => {
        if (line.length > 0) {
            const nodeIds = line.split(" ").map(x => parseInt(x));

            nodeIds.forEach(id => {
                if (!nodes.some(node => node.id === id)) {
                    nodes.push({ id: id });
                }
            });

            links.push({ source: nodeIds[0], target: nodeIds[1] });
        }
    });

    return { nodes: nodes, links: links };
}

function extOne(literals: string[]): string {
    return atlOne(literals) + atmOne(literals);
}

function atlOne(literals: string[]): string {
    return literals.join(" ") + "\n";
}

function atmOne(literals: string[]): string {
    let formulas = "";
    literals.forEach(function (val1, index) {
        literals.slice(index + 1).forEach(val2 => {
            formulas += `-${val1} -${val2}\n`;
        })
    })
    return formulas;
}

function varmap(id: number, color: number) {
    return `${id}_${color}`
}

export function graphFormula(graph: Graph, N: number): string {
    let formulas = "";

    for (let node of graph.nodes) {
        let literals = [];
        for (let n = 0; n < N; n++) {
            literals.push(varmap(node.id, n));
        }
        formulas += extOne(literals);
    }

    for (let link of graph.links) {
        for (let n = 0; n < N; n++) {
            formulas += atmOne([
                varmap(link.source, n),
                varmap(link.target, n)
            ]);
        }
    }

    return formulas.slice(0, formulas.length - 1);
}