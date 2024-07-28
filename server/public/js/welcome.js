async function goChat(e) {
    e.preventDefault();

    const res = await fetch('/chat', {
        method: 'GET'
    });

    alert(res.status);
}

document.querySelector('#enter').addEventListener('click', goChat);