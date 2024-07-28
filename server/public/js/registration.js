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

document.querySelector('#signup-form').addEventListener('submit', submitSignup);

async function submitSignup(e) {
    e.preventDefault();
    const username = document.querySelector("#user-text").value;
    const stuEmail = document.querySelector("#signup-email-text").value;
    const password = document.querySelector("#signup-pass").value;
    const confPwd = document.querySelector("#conf-pass").value;

    if (password === confPwd) {
        const res = await fetch('/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: username,
                pwd: password,
                email: stuEmail
            })
        });

        if (res.status === 201) {
            alert('Success');
        } else if (res.status === 409) {
            alert("Username or email already exists");
        }
    } else {
        alert("Password does not match confirmation");
    }
}

