let url = 'http://127.0.0.1:8000';

window.onload = function() {
    fetch(url, {mode: 'no-cors'})
    .then(response => response.text())
    .then(data => {
        // document.getElementById('mydiv').innerHTML = data;
        console.log(data);
    })
};