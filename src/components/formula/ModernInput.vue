<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'

const props = defineProps({
    formula: { type: String, required: true }
});

const emit = defineEmits<{
    (e: 'update:formula', value: string): void
}>();

const refs = ref<HTMLInputElement[]>([]);

const formulas = reactive([{ text: '', raw: '', valid: false }]);
insertFormulas(props.formula);

function validateFormula(formula: string): boolean {
    return /^ *(-?[a-zA-Z0-9_]+)( +-?[a-zA-Z0-9_]+)* *$/.test(formula);
}

function formatFormula(formula: string): string {
    return formula.trim()
        .replaceAll(/\s\s+/g, ' ')
        .replaceAll(/-/g, '¬')
        .replaceAll(/\s/g, ' ∨ ');
}

function focusInput(index: number, focus: boolean) {
    if (index >= formulas.length) return;
    let formula = formulas[index];
    if (focus) {
        formula.text = formula.raw;
    } else {
        formula.raw = formula.text;
        if (validateFormula(formula.raw)) {
            formula.text = formatFormula(formula.text)
        }
    }
}

function insertFormulas(text: string, focussed: boolean=false,index: number=0, selStart: number=0, selEnd: number=0): [number | null, number | null] {
    let focus: number | null = null;
    let cursorPos: number | null = null;

    let formula = formulas[index];
    let lines = text.split(/\r\n|\n/);

    let startString = formula.text.slice(0, selStart)
    let endString = formula.text.slice(selEnd, formula.text.length)
    let nextFormula = formula;
    for (let [i, line] of lines.entries()) {
        // line = line.trim().replaceAll(/[^a-zA-Z0-9_\- ]/g, '');
        if (i === 0) {
            line = startString + line;
        }
        if (i === lines.length - 1) {
            line += endString;
        }
        nextFormula.raw = line;
        nextFormula.valid = validateFormula(nextFormula.raw);
        cursorPos = nextFormula.raw.length - endString.length;
        if (i !== 0 || !focussed) {
            nextFormula.text = nextFormula.valid ? formatFormula(nextFormula.raw) : nextFormula.raw;
        } else {
            nextFormula.text = nextFormula.raw;
        }
        if (i !== 0) {
            formulas.splice(index + i, 0, nextFormula);
            if (focussed) {
                focus = index + i;
            }
        }
        nextFormula = { text: '', raw: '', valid: false };
    }
    return [focus, cursorPos];
}

async function keyDown(event: KeyboardEvent, index: number) {
    let key = event.key;

    if (!/[a-zA-Z0-9_\- ]/.test(key) && !["Backspace", "Enter", "Delete", "ArrowUp", "ArrowDown"].includes(key)) {
        event.preventDefault();
        return;
    }

    let selStart = refs.value[index].selectionStart;
    let selEnd = refs.value[index].selectionEnd;
    if (selStart === null || selEnd === null) return;

    let formula = formulas[index];
    let focus: number | null = null;
    let cursorPos: number | null = null;

    if (event.ctrlKey && (key === 'v' || key === 'V')) {
        event.preventDefault();
        let clipboard = await navigator.clipboard.readText();
        [focus, cursorPos] = insertFormulas(clipboard, true, index, selStart, selEnd);
        update();
    } else if (key === "Enter") {
        let currentString = formula.text.slice(0, selStart)
        let nextString = formula.text.slice(selEnd, formula.text.length)
        formula.text = currentString;
        formula.raw = formula.text;
        formula.valid = validateFormula(formula.raw)
        formulas.splice(index + 1, 0, { text: '', raw: nextString, valid: validateFormula(nextString) })
        focus = index + 1;
        cursorPos = 0;
        update();
    } else if (key === "Backspace") {
        if (selStart == 0 && selEnd == 0 && formulas.length > 1) {
            event.preventDefault();
            if (index > 0) {
                let formula = formulas[index];
                let prevFormula = formulas[index - 1];
                cursorPos = prevFormula.raw.length;
                prevFormula.raw += formula.text;
                prevFormula.valid = validateFormula(prevFormula.raw);
            }
            formulas.splice(index, 1);
            focusInput(index, true);  // Da ein Element gelöscht wird, wird focusInput mit false auf dem "falschen" Element ausgeführt
            if (index > 0) {
                focus = index - 1;
            }
            update();
        }
    } else if (key === "Delete") {
        if (selStart == formula.text.length && selEnd == formula.text.length && index < formulas.length - 1 && formulas.length > 1) {
            event.preventDefault();
            cursorPos = formula.text.length;

            let nextFormula = formulas[index + 1];
            formula.text += nextFormula.raw;
            formula.raw = formula.text
            formula.valid = validateFormula(formula.raw)
            formulas.splice(index + 1, 1);
            update();
        }
    } else if (key === "ArrowUp") {
        event.preventDefault();
        if (index > 0) {
            focus = index - 1;
            cursorPos = selStart
        }
    } else if (key === "ArrowDown") {
        event.preventDefault();
        if (index < formulas.length - 1) {
            focus = index + 1;
            cursorPos = selStart
        }
    }

    if (focus !== null && cursorPos !== null) {
        nextTick(() => {
            refs.value[focus!].focus();
            nextTick(() => {
                refs.value[focus!].setSelectionRange(cursorPos, cursorPos);
            });
        });
    } else if (focus !== null) {
        nextTick(() => {
            refs.value[focus!].focus();
        });
    } else if (cursorPos !== null) {
        nextTick(() => {
            refs.value[index].setSelectionRange(cursorPos, cursorPos);
        });
    }
}

function input(index: number) {
    let formula = formulas[index];
    formula.raw = formula.text;
    formula.valid = validateFormula(formula.raw);
    update();
}

function update() {
    let formulaStr: string = "";
    for (let formula of formulas) {
        formulaStr += formula.raw + '\n';
    }
    formulaStr = formulaStr.slice(0, formulaStr.length -1);
    console.log("update");

    emit("update:formula", formulaStr);
}
</script>

<template>
    <div>
        <div class="flex items-center" v-for="(item, index) in formulas">
            <span class="w-5 mb-1" v-if="index !== 0">∧</span>
            <span class="w-5" v-else></span>
            <input type="text" :name="'formula-' + index" autocomplete="off"
                   class="block overflow-ellipsis w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-1 px-4 mb-1 leading-tight focus:outline-none focus:bg-white"
                   :class="{ 'bg-red-100 border-red-600 border-2': !item.valid }" v-model="item.text"
                   @focusin="focusInput(index, true)"
                   @input="input(index)" @keydown="keyDown($event, index)"
                   @focusout="focusInput(index, false)" ref="refs" />
        </div>
    </div>
</template>
