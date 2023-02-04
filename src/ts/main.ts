// import { invoke } from "@tauri-apps/api/tauri";
import $ from "jquery";

type mobileMenuType = {
    isOpen: boolean,
    menu?: JQuery<HTMLElement>,
    buttonOpen?: JQuery<HTMLElement>,
    buttonClose?: JQuery<HTMLElement>
};

const mobileMenu: mobileMenuType = {
    isOpen: false
};

function toggleMobileMenu() {
    mobileMenu.isOpen = !mobileMenu.isOpen
    if (mobileMenu.isOpen) {
        mobileMenu.buttonOpen?.addClass("hidden");
        mobileMenu.buttonOpen?.removeClass("block");
        mobileMenu.buttonClose?.addClass("block");
        mobileMenu.buttonClose?.removeClass("hidden");

        mobileMenu.menu?.removeClass("hidden");
    } else {
        mobileMenu.buttonOpen?.addClass("block");
        mobileMenu.buttonOpen?.removeClass("hidden");
        mobileMenu.buttonClose?.addClass("hidden");
        mobileMenu.buttonClose?.removeClass("block");
        
        mobileMenu.menu?.addClass("hidden");
    }
}

type tabsType = {
    [key: string]: string
}

const tabs: tabsType = {
    ".menu-tab1": "./src/html/tab1.html",
    ".menu-tab2": "./src/html/tab2.html",
    ".menu-tab3": "./src/html/tab3.html"
}

function changeTab(tab: string) {
    $(".active-menu-tab").addClass("menu-tab")
    $(".active-menu-tab").removeClass("active-menu-tab")
    $(tab).addClass("active-menu-tab")
    $(tab).removeClass("menu-tab")

    let iframe = $("#content-frame")
    let parent = iframe.parent()
    iframe.attr("src", tabs[tab]).remove()
    parent.append(iframe)
}

function initMenu() {
    mobileMenu.menu = $("#mobile-menu");
    mobileMenu.buttonOpen = $("#mobile-menu-button-open");
    mobileMenu.buttonClose = $("#mobile-menu-button-close");
    $("#mobile-menu-button")?.on("click", () => toggleMobileMenu());

    for (let menuTab in tabs) {
        $(menuTab)?.on("click", () => changeTab(menuTab));
    }
}

window.addEventListener("DOMContentLoaded", () => {
    initMenu();
});
