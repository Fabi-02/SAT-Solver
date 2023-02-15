import { Eval } from "@/ts/formula";

export interface TreeNode {
    id: number;
    pathId: number;
    name: string;
    key: string;
    neg: boolean;
    result: Eval;
    unit_prop: boolean;
    children: TreeNode[];
}
