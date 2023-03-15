import { CNFResult, Eval, Model } from "@components/d3/types";

export const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});

export class CNF {
    clauses: Clause[];
    literals: string[];

    constructor(text: string) {
        this.clauses = []
        this.literals = []

        let lines = text.split(/\r\n|\n/);
        for (let line of lines) {
            this.clauses.push(new Clause(line));
        }

        for (let clause of this.clauses) {
            for (let literal of clause.literals) {
                if (!this.literals.includes(literal.identifier)) {
                    this.literals.push(literal.identifier);
                }
            }
        }
        this.literals.sort(collator.compare);
    }

    evaluate(model: Model): CNFResult {
        let is_unsat = false;
        let is_unknown = false;
        let results: {
            clause: Clause;
            result: Eval;
        }[] = [];

        for (let clause of this.clauses) {
            let result = clause.evaluate(model);
            results.push({
                clause: clause,
                result: result
            })
            if (result === "unsat") {
                is_unsat = true;
            }
            if (result === "unknown") {
                is_unknown = true;
            }
        }
        return {
            result: is_unsat ? "unsat" : is_unknown ? "unknown" : "sat",
            results: results
        }
    }
}

export class Clause {
    literals: Literal[];

    constructor(text: string) {
        this.literals = [];
        let literals = text.trim()
            .replaceAll(/\s\s+/g, " ")
            .split(" ")
        for (let literal of literals) {
            let neg = literal.startsWith("-");
            if (neg) {
                literal = literal.slice(1);
            }
            this.literals.push(new Literal(literal, neg));
        }
    }

    evaluate(model: Model): Eval {
        let identifier_unknown = false;
        for (let literal of this.literals) {
            if (!(literal.identifier in model)) {
                identifier_unknown = true;
                continue;
            }
            let value = model[literal.identifier];
            if (literal.neg) {
                value = !value;
            }
            if (value) {
                return "sat";
            }
        }
        if (!identifier_unknown) {
            return "unsat";
        } else {
            return "unknown";
        }
    }
}

export class Literal {
    identifier: string;
    neg: boolean;

    constructor(identifier: string, neg: boolean) {
        this.identifier = identifier;
        this.neg = neg;
    }
}
