let loginButton = document.getElementById('redirectLogin');

loginButton.addEventListener('click', async function (event) {
    event.preventDefault();

    const navi = document.getElementById('navigation');
    navi.removeAttribute("hidden");
    window.history.replaceState({}, "", '/');
    urlLocationHandler();

    // load home page
});

async function twofa(data) {
    try {
    let message = prompt("Enter your 2FA code:");
            console.log(message);
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
                console.log(data['access_token']);
                document.cookie = `access_token=${data2['access_token'].access}; path=/;`;
                document.cookie = `refresh_token=${data2['access_token'].refresh}; path=/;`;
                document.getElementById('redirectLogin').disabled = false;
            }
            else if (data2['status'] === 402) {
                // Wrong 2FA
                console.log("Wrong 2FA");
                twofa(data);
            }
            else {
                // Handle other potential errors
                console.error("Unexpected response status:", response.status);
            }
        return data2;
    } catch (error) {
        // Handle general errors
        console.error("Error:", error);
    }
}

async function ft_login() { // Attach event listener to window.onload
    console.log('42auth logging in hell yeah!');
    try {
        const response = await fetch(window.location.origin + '/api/redirect_auth/', {
            method: 'POST',
            body: JSON.stringify({
                'url': '{URL}' // Replace with your actual URL
            }),
            headers: {
                'Content-type': 'application/json',
            }
        });

        const data = await response.json();
        if (data['twofa'] === true) {
            twofa(data);
            // await random();
            return;

        }
        else if (data['status'] === 200) {
            // Successful login
            console.log('42auth logged in');
            console.log(data['access_token']);
            document.cookie = `access_token=${data['access_token'].access}; path=/;`;
            document.cookie = `refresh_token=${data['access_token'].refresh}; path=/;`;
            document.getElementById('redirectLogin').disabled = false;
            // Load home page
        } else if (response.status === 400) {
            // Wrong Password
            console.log("Wrong Password");
        } else {
            // Handle other potential errors
            console.error("Unexpected response status:", response.status);
        }
    } catch (error) {
        // Handle general errors
        console.error("Error:", error);
    }
};

ft_login();