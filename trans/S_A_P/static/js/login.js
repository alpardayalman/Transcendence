loginButton = document.getElementById('login_btn');

loginButton.addEventListener('click', async function(event){
    event.preventDefault();
    var username = document.querySelector('.usernameLogin').value;
    var password = document.querySelector('.passwordLogin').value;
    console.log(window.location.origin + '/api/login/');
    console.log(username);
    console.log(password);
    var response = await fetch(window.location.origin + '/api/login/', {
        method: 'POST',
        body: JSON.stringify({
            'username': username,
            'password': password
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
    .catch(err => console.log('Error: ', err));
    var data = await response.json();
    if (data['status'] === 200) {
        console.log('logged in');
        // window.stop();
        const file = await fetch(window.location.origin + '/' + 'profile.')
        .then(response => response.text());
        document = file;

        // window.history.replaceState({}, "", '/');

        urlLocationHandler();
        // const navi = document.getElementById('navigation');
        // navi.removeAttribute("hidden");

        // load home page
    }
});