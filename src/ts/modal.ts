import { reactive } from "vue";

export type ModalType = "NodeInfo";

export const modalData = reactive({
    show: false,
    modalType: '' as ModalType,
    data: null as any
});

export function showModal(modalType: ModalType, data: any) {
    modalData.modalType = modalType;
    modalData.data = data;
    modalData.show = true;
}

export function closeModal() {
    modalData.show = false;
}
