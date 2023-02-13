export class CNF {
    formulas: Formula[];

    constructor(text: string) {
        this.formulas = []
        let lines = text.trim()
            .replaceAll(/\s\s+/g, " ")
            .split(/\r\n|\n/);
        for (let line of lines) {
            this.formulas.push(new Formula(line));
        }
    }
}

export class Formula {
    variables: Variable[];

    constructor(text: string) {
        this.variables = [];
        let variables = text.split(" ")
        for (let variable of variables) {
            let neg = variable.startsWith("-");
            if (neg) {
                variable = variable.slice(1);
            }
            this.variables.push(new Variable(variable, neg));
        }
    }
}

export class Variable {
    identifier: string;
    neg: boolean;

    constructor(identifier: string, neg: boolean) {
        this.identifier = identifier;
        this.neg = neg;
    }
}
