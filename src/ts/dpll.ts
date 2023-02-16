import { CNF, Eval, Model } from "@ts/formula";

export interface DpllResult {
    result: Eval;
    model: Model;
    unit_prop: boolean;
}

function unitPropagation(cnf: CNF, model: Model): boolean {
    for (let clause of cnf.clauses) {
        let result = clause.evaluate(model)
        if (result !== "unknown") continue;
        let unknown_literals = clause.literals.filter(literal => !(literal.identifier in model));
        if (unknown_literals.length === 1) {
            let literal = unknown_literals[0];
            model[literal.identifier] = !literal.neg;
            return true;
        }
    }
    return false;
}

export function* dpll(cnf: CNF, model: Model = {}): Generator<DpllResult> {
    let literals = cnf.literals;

    let  unit_prop = false;
    do {
        let cnf_result = cnf.evaluate(model);
        yield {
            result: cnf_result,
            model: {...model},
            unit_prop: unit_prop
        };
        if (Object.keys(model).length == literals.length || cnf_result !== "unknown") {
            return;
        }
        unit_prop = true;
    } while(unitPropagation(cnf, model));
    
    let model1 = {...model};
    let model2 = {...model};
    
    let next_literal: string | null = null;
    for (let literal of literals) {
        if (!(literal in model)) {
            next_literal = literal;
            break;
        }
    }
    if (next_literal == null) return;

    model1[next_literal] = false
    let dpll_result = dpll(cnf, model1);

    let last_result: Eval = "unknown";
    for (let result of dpll_result) {
        last_result = result.result;
        yield result;
    }
    if (last_result === "sat") return;

    model2[next_literal] = true
    dpll_result = dpll(cnf, model2);
    yield* dpll_result;
}
