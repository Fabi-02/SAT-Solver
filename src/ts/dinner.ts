// The Dupont family will visit us tonight," Mr. Martin announces. "The whole family, that is, Mr. and
// Mrs. Dupont and their three children Emma, Georg and Ivana?" Mrs. Martin asks in dismay.
// Mr. Martin replies: "That's the problem: they wanted to make a secret about who exactly wants to come. 
// But we know: If Mr. uDpont comes, then his wife will come, too.
// At least one of the two children Ivana and Georg will come. Either Mrs. Dupont or Emma will come.
// Either Emma and Georg come both, or they both don't come. And if Ivana comes, then also Georg and
// Mr. Dupont will come.

// Family:
// - Mr. Dupont     (MD)
// - Mrs. Dupont    (FD)
// - Ivana          (I)
// - Georg          (G)
// - Emma           (E)

export function dinnerFormula(): string {
    let formula: string = "";

    // If Mr. Dupont comes, then his wife will come, too.
    // MD -> FD => -MD | FD
    formula += "-MD FD\n";
    
    // At least one of the two children Ivana and Georg will come.
    // I | G
    formula += "I G\n";
    
    // Either Mrs. Dupont or Emma will come.
    // FD XOR E => (FD | E) & (-FD | -E)
    formula += "FD E\n";
    formula += "-FD -E\n";
    

    // Either Emma and Georg come both, or they both don't come.
    // (E & G) | (-E & -G) => (E | -G) & (-E | G)
    formula += "E -G\n";
    formula += "-E G\n";

    // And if Ivana comes, then also Georg and  Mr. Dupont will come.
    // I -> G & MD => -I | (G & MD) => (-I | G) & (-I | MD)
    formula += "-I G\n";
    formula += "-I MD";

    return formula;
}
