loginButton = document.getElementById('login_btn');

async function twofalogin(data) {
    try {
        let message = prompt("Enter your 2FA code:");
            const response = await fetch(window.location.origin + '/api/verify-2fa/', {
                method: 'POST',
                body: JSON.stringify({
                    'verification_code': message,
                    'username': data['username'],
                }),
                headers: {
                    'Content-type': 'application/json',
                }
            });
            const data2 = await response.json();
            if (data2['status'] === 200) {
                document.cookie = `access_token=${data2['access_token'].access}; path=/;`;
                document.cookie = `refresh_token=${data2['access_token'].refresh}; path=/;`;
                if(document.cookie.includes('access_token')){
                    const navi = document.getElementById('navigation');
                    navi.removeAttribute("hidden");
                    replacePage('/');
                }
                return (0);

            }
            else {
                console.error("Unexpected response status:", response.status);
                return;
            }
    } catch (error) {
        console.error("Error:", error);
        return;
    }
}

loginButton.addEventListener('click', async function(event){
    event.preventDefault();
    var username = document.querySelector('.usernameLogin').value;
    var password = document.querySelector('.passwordLogin').value;

    var response = await fetch(window.location.origin + '/api/login/', {
        method: 'POST',
        body: JSON.stringify({
            'username': username,
            'password': password,
        }),
        headers: {
            'Content-type': 'application/json',
        }
    })
    
    .catch(err => console.log('Error: ', err));
    var data = await response.json();
    if (data['twofa'] === true) {
        twofalogin(data);
        return;
    }
    else if (data['status'] === 200) {
        document.cookie = `access_token=${data['access_token'].access};path=/;` ;
        document.cookie = `refresh_token=${data['access_token'].refresh};path=/;`;
        const navi = document.getElementById('navigation');
        navi.removeAttribute("hidden");
        urlRoute(event);
    }
    else if (response.status === 400)
    {
        alert('Wrong Password');
    }
});

FtButton.addEventListener('click', async function(event){
    fetch('/api/login_with_42/')
    .then(response => response.json())
    .then(data => {
        window.location.href = data.code;
    })
    .catch(error => console.error('Error:', error));
});