export type Eval = "sat" | "unsat" | "unknown";

export interface Model {
    [literal:string]: boolean;
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
