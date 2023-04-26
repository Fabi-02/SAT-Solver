import { Graph, InteractionGraph } from "@components/d3/types";
import { CNF } from "./formula";

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

export function formulaToInteractionGraph(formula: string): InteractionGraph {
    let cnf = new CNF(formula);

    let ids: { [id: string]: number } = {};
    let interactions: { [id1: string]: [string] } = {}

    let i = 0;
    for (let clause of cnf.clauses) {
        for (let literal1 of clause.literals) {
            let id1 = literal1.identifier;
            if (!(id1 in ids)) {
                ids[id1] = i++;
            }
            for (let literal2 of clause.literals) {
                let id2 = literal2.identifier;
                if (id1 === id2) continue;
                if (id1 in interactions && interactions[id1].includes(id2)) continue;
                if (id2 in interactions && interactions[id2].includes(id1)) continue;
                if (!(id1 in interactions)) {
                    interactions[id1] = [id2];
                } else {
                    interactions[id1].push(id2);
                }
            }
        }
    }

    let nodes: { id: number, literal: string }[] = [];
    let links: { source: number, target: number }[] = [];

    for (let [literal, id] of Object.entries(ids)) {
        nodes.push({
            id: id,
            literal: literal
        })
    }

    for (let id1 in interactions) {
        for (let id2 of interactions[id1]) {
            links.push({ source: ids[id1], target: ids[id2] });
        }
    }

    return { nodes: nodes, links: links };
}