import { reactive } from "vue";

export const modalData = reactive({
    show: false,
    header: '',
    body: ''
});

export function showModal(header: string, body: string) {
    modalData.header = header;
    modalData.body = body;
    modalData.show = true;
}

export function closeModal() {
    modalData.show = false;
}
