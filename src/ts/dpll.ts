import { CNFResult, DpllResult, Eval, Model } from "@/components/d3/types";
import { CNF } from "@ts/formula";

function unitPropagation(cnf: CNFResult, model: Model): boolean {
    for (let clause_result of cnf.results) {
        let clause = clause_result.clause;
        let result = clause_result.result;
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

export function* dpll(cnf: CNF, useUnitProp: boolean=true, model: Model = {}): Generator<DpllResult> {
    let literals = cnf.literals;

    let  unitProp = false;
    let cnf_result: CNFResult;
    do {
        cnf_result = cnf.evaluate(model);
        yield {
            cnf_result: cnf_result,
            model: {...model},
            unit_prop: unitProp
        };
        if (Object.keys(model).length == literals.length || cnf_result.result !== "unknown") {
            return;
        }
        if (!useUnitProp) break;
        unitProp = true;
    } while(unitPropagation(cnf_result, model));
    
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

    model1[next_literal] = false;
    let dpll_result = dpll(cnf, useUnitProp, model1);

    let last_result: DpllResult | null = null;
    for (let result of dpll_result) {
        last_result = result;
        yield result;
    }
    if (last_result && last_result.cnf_result.result === "sat") return;

    model2[next_literal] = true;
    dpll_result = dpll(cnf, useUnitProp, model2);
    yield* dpll_result;
}
