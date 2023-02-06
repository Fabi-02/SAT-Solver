<script setup lang="ts">
import { ref, nextTick } from 'vue'

const formulas = ref([{ text: '', raw: '' }])
const refs = ref<HTMLInputElement[]>([])

function formatString(str: string): string {
    return str.trim()
            .replaceAll(/\s\s+/g, ' ')
            .replaceAll(/-/g, '¬')
            .replaceAll(/\s/g, ' ∨ ');
}

function focusInput(index: number, focus: boolean) {
    if (index >= formulas.value.length) return;
    let formula = formulas.value[index];
    if (focus) {
        formula.text = formula.raw;
    } else {
        formula.raw = formula.text;
        formula.text = formatString(formula.text)
    }
}

async function keyDown(event: KeyboardEvent, index:number) {
    let key = event.key;

    if (!/[a-zA-Z0-9_\- ]/.test(key) && !["Backspace", "Enter", "Delete", "ArrowUp", "ArrowDown"].includes(key)) {
        event.preventDefault();
        event.key
        return;
    }
    
    let selStart = refs.value[index].selectionStart;
    let selEnd = refs.value[index].selectionEnd;
    if (selStart === null || selEnd === null) return;
    
    let formula = formulas.value[index];
    let focus: number | null = null;
    let cursorPos: number | null = null;
    
    if (event.ctrlKey && (key === 'v' || key === 'V')) {
        event.preventDefault();
        let clipboard = await navigator.clipboard.readText();
        let lines = clipboard.split('\n');

        let startString = formula.text.slice(0, selStart)
        let endString = formula.text.slice(selEnd, formula.text.length)
        let nextFormula = formula;
        for (let [i, line] of lines.entries()) {
            line = line.trim().replaceAll(/[^a-zA-Z0-9_\- ]/g, '');
            if (i === 0) {
                line = startString + line;
            }
            if (i === lines.length - 1) {
                line += endString;
            }
            nextFormula.raw = line;
            cursorPos = nextFormula.raw.length - endString.length;
            if (i !== 0) {
                nextFormula.text = formatString(nextFormula.raw);
                formulas.value.splice(index + i, 0, nextFormula);
                focus = index + i;
            } else {
                nextFormula.text = nextFormula.raw;
            }
            nextFormula = { text: '', raw: '' };
        }
    } else if (key === "Enter") {
        let currentString = formula.text.slice(0, selStart)
        let nextString = formula.text.slice(selEnd, formula.text.length)
        formula.text = currentString;
        formulas.value.splice(index + 1, 0, { text: '', raw: nextString })
        focus = index + 1;
        cursorPos = 0;
        
    } else if (key === "Backspace") {
        if (selStart == 0 && selEnd == 0 && formulas.value.length > 1) {
            event.preventDefault();
            if (index > 0) {
                let formula = formulas.value[index];
                let prevFormula = formulas.value[index - 1];
                cursorPos = prevFormula.raw.length;
                prevFormula.raw += formula.text;
            }
            formulas.value.splice(index, 1);
            focusInput(index, true);  // Da ein Element gelöscht wird, wird focusInput mit false auf dem "falschen" Element ausgeführt
            if (index > 0) {
                focus = index - 1;
            }
        }
    } else if (key === "Delete") {
        if (selStart == formula.text.length && selEnd == formula.text.length && index < formulas.value.length - 1 && formulas.value.length > 1) {
            event.preventDefault();
            cursorPos = formula.text.length;

            let nextFormula = formulas.value[index + 1];
            formula.text += nextFormula.raw;
            formulas.value.splice(index + 1, 1);
        }
    } else if (key === "ArrowUp") {
        event.preventDefault();
        if (index > 0) {
            focus = index - 1;
            cursorPos = selStart
        }
    } else if (key === "ArrowDown") {
        event.preventDefault();
        if (index < formulas.value.length - 1) {
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
</script>

<template>
    <div>
        <div class="flex items-center" v-for="(item, index) in formulas" >
            <span class="w-5 mb-1" v-if="index !== 0">∧</span>
            <span class="w-5" v-else></span>
            <input type="text" :name="'formula-' + index"
                class="block overflow-ellipsis w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-1 px-4 mb-1 leading-tight focus:outline-none focus:bg-white"
                v-model="item.text" @focusin="focusInput(index, true)" @focusout="focusInput(index, false)"
                @keydown="keyDown($event, index)" ref="refs"/>
        </div>
    </div>
</template>
