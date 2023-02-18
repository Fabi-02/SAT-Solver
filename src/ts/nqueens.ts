function extOne(literals: string[]): string {
    return atlOne(literals) + atmOne(literals);
}

function atlOne(literals: string[]): string {
    return literals.join(" ") + "\n";
}

function atmOne(literals: string[]): string {
    let formulas = "";
    literals.forEach(function (val1, index) {
        literals.slice(index + 1).forEach(val2 => {
            formulas += `-${val1} -${val2}\n`;
        })
    })
    return formulas;
}

function varmap(r: number, c: number): string {
    return `${r + 1}_${c + 1}`;
    // return r*4+c+1 + "";
}

export function nQueensFormula(N: number): string {
    const Ns = [...Array(N).keys()]
    let formulas = "";

    // exactly 1 queen per row
    Ns.forEach(r => {
        let literals: string[] = [];
        Ns.forEach(c => {
            literals.push(varmap(r, c));
        });
        formulas += extOne(literals);
    });

    // exactly 1 queen per column
    Ns.forEach(c => {
        let literals: string[] = [];
        Ns.forEach(r => {
            literals.push(varmap(r, c));
        });
        formulas += extOne(literals);
    });

    // atmost 1 queen per negative diagonal from left
    Ns.slice().reverse().forEach(r => {
        let literals: string[] = [];
        Ns.slice(0, N - r).forEach(x => {
            literals.push(varmap(r + x, x));
        });
        formulas += atmOne(literals);
    });


    // atmost 1 queen per negative diagonal from top
    Ns.slice(1, N).forEach(c => {
        let literals: string[] = [];
        Ns.slice(0, N - c).forEach(x => {
            literals.push(varmap(x, c + x));
        });
        formulas += atmOne(literals);
    });

    // atmost 1 queen per positive diagonal from right
    Ns.slice().reverse().forEach(r => {
        let literals: string[] = [];
        Ns.slice(0, N - r).forEach(x => {
            literals.push(varmap(r + x, N - 1 - x));
        });
        formulas += atmOne(literals);
    });

    // atmost 1 queen per positive diagonal from top
    Ns.slice(0, N-1).reverse().forEach(c => {
        let literals: string[] = [];
        Ns.slice(0, c + 1).forEach(x => {
            literals.push(varmap(x, c - x));
        });
        formulas += atmOne(literals);
    });

    return formulas.slice(0, formulas.length - 1);
}
