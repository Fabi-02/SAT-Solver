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

function varmap(r: number, c: number, n: number): string {
    return `${r + 1}_${c + 1}_${n + 1}`;
}

export function sudokuFormula(N: number): string {
    let NN = N * N;
    let formulas = "";

    // exactly one number per cell
    for (let r = 0; r < NN; r++) {
        for (let c = 0; c < NN; c++) {
            let literals = [];
            for (let n = 0; n < NN; n++) {
                literals.push(varmap(r, c , n));
            }
            formulas += extOne(literals);
        }
    }
    
    for (let n = 0; n < NN; n++) {
        // number in row
        for (let r = 0; r < NN; r++) {
            let literals = [];
            for (let c = 0; c < NN; c++) {
                literals.push(varmap(r, c, n));
            }
            formulas += atlOne(literals);
        }

        // number in col
        for (let c = 0; c < NN; c++) {
            let literals = [];
            for (let r = 0; r < NN; r++) {
                literals.push(varmap(r, c, n));
            }
            formulas += atlOne(literals);
        }

        // number in subgrid
        for (let r = 0; r < N; r++) {
            for (let c = 0; c < N; c++) {
                let literals = [];
                for (let sr = 0; sr < N; sr++) {
                    for (let sc = 0; sc < N; sc++) {
                        literals.push(varmap((r * N) + sr, (c * N) + sc, n));
                    }
                }
                formulas += atlOne(literals);
            }
        }
    }
    
    return formulas.slice(0, formulas.length - 1);
}
