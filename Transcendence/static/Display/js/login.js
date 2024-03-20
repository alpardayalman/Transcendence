loginButton = document.getElementById('login_btn');

function gdpr() {

    let message = "By clicking OK, you agree to the use of cookies and to our ";
    message += "privacy policy. If you want to know more about our privacy policy, ";
    message += "you can see it in the new tab if you decline.";

    let agreed = confirm(message);

    if (agreed) {
        return true;
    }
    else {
        const newWindow = window.open("https://commission.europa.eu/law/law-topic/data-protection/data-protection-eu_en", '_blank');
        newWindow.focus();
        window.focus();
        return false;
    }
}


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
    if(gdpr() === false){
        return;
    }
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
    if(gdpr() == false){
        return;
    }
    fetch('/api/login_with_42/')
    .then(response => response.json())
    .then(data => {
        window.location.href = data.code;
    })
    .catch(error => console.error('Error:', error));
});
