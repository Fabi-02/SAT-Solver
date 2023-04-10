import { Clause } from "@ts/formula";

export type Eval = "sat" | "unsat" | "unknown";

export interface CNFResult {
    result: Eval;
    results: {
        clause: Clause;
        result: Eval;
    }[]
} 

export interface Model {
    [literal:string]: boolean;
}

export interface DpllResult {
    cnf_result: CNFResult;
    model: Model;
    unit_prop: boolean;
}

export interface TreeNode {
    id: number;
    pathId: number;
    name: string;
    key: string;
    neg: boolean;
    result: Eval;
    unit_prop: boolean;
    sat_path: boolean;
    children: TreeNode[];
}

export interface Graph {
    nodes: {
        id: number
    }[],
    links: {
        source: number,
        target: number
    }[]
}
