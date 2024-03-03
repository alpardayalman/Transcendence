let loginButton = document.getElementById('redirectLogin');

loginButton.addEventListener('click', async function(event){
    event.preventDefault();

    const navi = document.getElementById('navigation');
    navi.removeAttribute("hidden");
    window.history.replaceState({}, "", '/');
    urlLocationHandler();

        // load home page
});

// addEventListener("DOMContentLoaded", async (event) => {
//     var response = await fetch(window.location.origin + '/api/redirect_auth/', {
//         method: 'POST',
//         body: JSON.stringify({
//             'url' : '{URL}'
//         }),
//         headers: {
//             'Content-type': 'application/json',
//         }
//     })
    
//     .catch(err => console.log('Error: ', err));
//     var data = await response.json();
//     if (data['status'] === 200) {
//         // window.stop();
//         console.log('42auth logged in');
//         // window.history.replaceState({}, "", '/');
//         document.cookie = `access_token=${data['access_token'].access}`;
//         document.cookie = `refresh_token=${data['access_token'].refresh}`;

//         // load home page
//     }
//     else if (response.status === 400)
//     {
//         // Wrong Password
//         console.log("Wrong Password");
//     }
// });

async function yarraq(){ // Attach event listener to window.onload
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

        if (data['status'] === 200) {
            // Successful login
            console.log('42auth logged in');
            console.log(data['access_token']);
            document.cookie = `access_token=${data['access_token'].access}; path=/;`;
            document.cookie = `refresh_token=${data['access_token'].refresh}; path=/;`;
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

yarraq();