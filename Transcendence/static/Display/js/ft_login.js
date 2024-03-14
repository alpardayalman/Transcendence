let loginButton = document.getElementById('redirectLogin');

loginButton.addEventListener('click', async function (event) {
    event.preventDefault();

    const navi = document.getElementById('navigation');
    navi.removeAttribute("hidden");
    window.history.replaceState({}, "", '/');
    urlLocationHandler();

    // load home page
});

async function twofa(data, flag = 0) {
    try {
        let message;
        if (flag === 1) { 
            message = prompt("Wrong 2FA code. Please enter your 2FA code:");
        }
        else 
            message = prompt("Enter your 2FA code:");
            console.log(message);
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
                console.log(data['access_token']);
                document.cookie = `access_token=${data2['access_token'].access}; path=/;`;
                document.cookie = `refresh_token=${data2['access_token'].refresh}; path=/;`;
                document.getElementById('redirectLogin').disabled = false;
                return;
            }
            else if (data2['status'] === 402) {
                // Wrong 2FA
                console.log("Wrong 2FA");
                twofa(data, 1);
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
    console.log(window.location.origin)
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
            console.log("2FA");
            twofa(data);
            // await random();
            return;

        }
        else if (data['status'] === 200) {
            // Successful login
            document.getElementById("loading-img").style.display = "none";
            document.getElementById("redirectLogin").style.display = "block";
            document.cookie = `access_token=${data['access_token'].access}; path=/;`;
            document.cookie = `refresh_token=${data['access_token'].refresh}; path=/;`;
            document.getElementById('redirectLogin').disabled = false;
            // Load home page
            return;
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