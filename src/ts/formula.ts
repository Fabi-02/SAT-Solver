export class CNF {
    formulas: Formula[];

    constructor(text: string) {
        this.formulas = []
        for (let line of text.split("\n")) {
            this.formulas.push(new Formula(line));
        }
    }
}

export class Formula {
    variables: Variable[];

    constructor(text: string) {
        this.variables = [];
        let variables = text.trim()
            .replaceAll(/\s\s+/g, ' ')
            .split(/\r\n|\n/);
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
    text: string;
    neg: boolean;

    constructor(text: string, neg: boolean) {
        this.text = text;
        this.neg = neg;
    }
}
