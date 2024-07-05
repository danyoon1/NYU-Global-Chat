function toggleTab(tabIndex) {
    let tabs = document.getElementsByClassName("tab");
    for (let i=0; i<tabs.length; i++) {
        tabs[i].style.display = "none";
    }
    tabs[tabIndex].style.display = "block";

    // remove all active tabs
    let buttons = document.getElementsByClassName("tab-button");
    for (let i=0; i<tabs.length; i++) {
        buttons[i].classList.remove("active-tab-button");
    }
    
    // set active tab
    buttons[tabIndex].classList.add("active-tab-button");
}

toggleTab(0);