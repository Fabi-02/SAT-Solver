# SAT-Solver

## Beschreibung

Bei diesem Projekt handelt es sich um eine Visualisierung von einem SAT-Solver. Dabei wurde der DPLL-Algorithmus implementiert. Zur Visualisierung wird der Suchbaum und der Variable Interaction Graph eines Problemes dargestellt. Dabei können eigene Formeln übergeben werden oder Beispielprobleme ausgeführt werden.

Implementierte Beispielprobleme:
* N-Damen Problem 
* Sudoku lösen 
* Graphenfärbung

Diese Anwendung wurde im Rahmen einer Studienarbeit entwickelt.

## Dependencies

* [Node.js](https://nodejs.org/de/)
* [Rust](https://www.rust-lang.org/tools/install)

## Installation

1. Repository klonen: `git clone https://github.com/Fabi-02/SAT-Solver.git`
2. In das Projektverzeichnis wechseln: `cd SAT-Solver`
3. Dependencies installieren: `npm install`
4. Im Entwicklungsmodus starten: `npm run tauri dev` 

Um die Applikation zu bauen wird folgender Befehl verwendet: `npm run tauri build`

Nun befindet sich unter dem Pfad `./src-tauri/target/release/bundle/msi` der Installer für die Applikation.
