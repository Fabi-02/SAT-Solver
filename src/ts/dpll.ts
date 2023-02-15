import { CNF, Eval, Model } from "@ts/formula";

export interface DpllResult {
    result: Eval;
    model: Model;
}

export function* dpll(cnf: CNF, model: Model = {}): Generator<DpllResult> {
    let literals = cnf.literals;
    let model_len = Object.keys(model).length;

    let cnf_result = cnf.evaluate(model);
    yield {
        result: cnf_result,
        model: model
    }
    if (model_len == literals.length || cnf_result !== "unknown") {
        return;
    }
    let model1 = {...model};
    let model2 = {...model};
    
    let next_literal = literals[model_len];

    model1[next_literal] = true
    let dpll_result = dpll(cnf, model1);

    let last_result: Eval = "unknown";
    for (let result of dpll_result) {
        last_result = result.result;
        yield result;
    }
    if (last_result === "sat") return;

    model2[next_literal] = false
    dpll_result = dpll(cnf, model2);
    yield* dpll_result;
}
