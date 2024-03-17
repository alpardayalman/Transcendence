let loginButton = document.getElementById('redirectLogin');

loginButton.addEventListener('click', async function (event) {
    event.preventDefault();

    const navi = document.getElementById('navigation');
    navi.removeAttribute("hidden");
    window.history.replaceState({}, "", '/');
    urlLocationHandler();

});

async function twofa(data, flag = 0) {
    try {
        let message;
        if (flag === 1) { 
            message = prompt("Wrong 2FA code. Please enter your 2FA code:");
        }
        else 
            message = prompt("Enter your 2FA code:");
            if (message === null) {
                window.history.replaceState({}, "", '/');
                urlLocationHandler();
                return;
            }
            const response = await fetch(window.location.origin + '/api/verify-2fa/', {
                method: 'POST',
                body: JSON.stringify({
                    'verification_code': message, // Replace with your actual URL
                    'username': data['username'],
                }),
                headers: {
                    'Content-type': 'application/json',
                }
            });
            const data2 = await response.json();
            if (data2['status'] === 200) {
                document.getElementById("loading-img").style.display = "none";
                document.getElementById("redirectLogin").style.display = "block";
                document.cookie = `access_token=${data2['access_token'].access}; path=/;`;
                document.cookie = `refresh_token=${data2['access_token'].refresh}; path=/;`;
                document.getElementById('redirectLogin').disabled = false;
                return;
            }
            else if (data2['status'] === 402) {
                twofa(data, 1);
            }
            else {
                console.error("Unexpected response status:", response.status);
            }
        return data2;
    } catch (error) {
        console.error("Error:", error);
    }
}

async function ft_login() { 
    try {
        const response = await fetch(window.location.origin + '/api/redirect_auth/', {
            method: 'POST',
            body: JSON.stringify({
                'url': '{URL}' 
            }),
            headers: {
                'Content-type': 'application/json',
            }
        });

        const data = await response.json();
        if (data['twofa'] === true) {
            twofa(data);
            return;

        }
        else if (data['status'] === 200) {
            document.getElementById("loading-img").style.display = "none";
            document.getElementById("redirectLogin").style.display = "block";
            document.cookie = `access_token=${data['access_token'].access}; path=/;`;
            document.cookie = `refresh_token=${data['access_token'].refresh}; path=/;`;
            document.getElementById('redirectLogin').disabled = false;
            return;
        } else if (response.status === 400) {
            alert("Wrong login credentials. Please try again.");
        } else {
            console.error("Unexpected response status:", response.status);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

ft_login();