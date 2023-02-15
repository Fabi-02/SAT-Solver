import { Eval } from "@/ts/formula";

export interface TreeNode {
    id: number;
    pathId: number;
    name: string;
    result: Eval;
    children?: TreeNode[];
}
