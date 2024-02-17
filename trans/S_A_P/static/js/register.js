registerButton = document.querySelector('.registerButton');

registerButton.addEventListener('click', async function(event){
    // event.preventDefault();
    console.log(event);
    console.log(window.location.origin + '/api/register/');
    var response = await fetch(window.location.origin + '/api/register/', {
        method: 'POST',
        body: JSON.stringify({
            'username': username,
            'password': password
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    var data = await response.json();
    if (data['status'] === 200) {
        console.log('logged in');
        // load home page

    

    }
});