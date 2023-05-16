import { CNFResult, DpllResult, Eval, Model } from "@components/d3/types";
import { CNF } from "@ts/formula";

type Pure = "neg" | "pos" | "unpure";

function pureLiteralElimination(cnf: CNFResult, model: Model): boolean {
    let pureLiterals: { [literal: string]: Pure } = {};
    for (let clause_result of cnf.results) {
        let clause = clause_result.clause;
        let result = clause_result.result;
        if (result !== "unknown") continue;
        let unknown_literals = clause.literals.filter(literal => !(literal.identifier in model));
        for (let unknown_literal of unknown_literals) {
            if (unknown_literal.identifier in pureLiterals) {
                if (pureLiterals[unknown_literal.identifier] === "neg" && !unknown_literal.neg) {
                    pureLiterals[unknown_literal.identifier] = "unpure";
                } else if (pureLiterals[unknown_literal.identifier] === "pos" && unknown_literal.neg) {
                    pureLiterals[unknown_literal.identifier] = "unpure";
                }
            } else {
                pureLiterals[unknown_literal.identifier] = unknown_literal.neg ? "neg" : "pos";
            }
        }
    }
    for (let literal in pureLiterals) {
        if (pureLiterals[literal] !== "unpure") {
            model[literal] = pureLiterals[literal] === "pos";
            return true;
        }
    }
    return false;
}

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

export interface Heuristic {
    unit_prop: boolean;
    pure_literal: boolean;
}

function run_heuristics(cnf: CNFResult, model: Model, heuristic: Heuristic): boolean {
    if (heuristic.pure_literal) {
        if (pureLiteralElimination(cnf, model)) return true;
    }
    if (heuristic.unit_prop) {
        if (unitPropagation(cnf, model)) return true;
    }
    return false;
}

export function* dpll(cnf: CNF, heuristic: Heuristic, model: Model = {}): Generator<DpllResult> {
    let literals = cnf.literals;

    let use_heuristic = false;
    let cnf_result: CNFResult;
    do {
        cnf_result = cnf.evaluate(model);
        yield {
            cnf_result: cnf_result,
            model: {...model},
            heuristic: use_heuristic
        };
        if (Object.keys(model).length == literals.length || cnf_result.result !== "unknown") {
            return;
        }
    } while(use_heuristic = run_heuristics(cnf_result, model, heuristic));
    
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
    let dpll_result = dpll(cnf, heuristic, model1);

    let last_result: DpllResult | null = null;
    for (let result of dpll_result) {
        last_result = result;
        yield result;
    }
    if (last_result && last_result.cnf_result.result === "sat") return;

    model2[next_literal] = true;
    dpll_result = dpll(cnf, heuristic, model2);
    yield* dpll_result;
}
