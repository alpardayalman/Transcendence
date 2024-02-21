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
            'password': password,
        }),
        headers: {
            'Content-type': 'application/json',
        }
    })
    .catch(err => console.log('Error: ', err));
    var data = await response.json();
    if (data['status'] === 200) {
        console.log('logged in');
        // window.stop();

        // window.history.replaceState({}, "", '/');
        
        const navi = document.getElementById('navigation');
        navi.removeAttribute("hidden");
        urlRoute(event);

        // load home page
    }
    else if (response.status === 400)
    {
        // Wrong Password
        console.log("Wrong Password");
    }
});


// FtButton = document.getElementById('FtButton');


// function openNewTab(script) {
//     var scriptElement = document.createElement('script');
//     scriptElement.text = script;
//     document.head.appendChild(scriptElement);
// }


// window.addEventListener('message', function(event) {
//     if (event.data === 'logged_in') {
//         // Execute the received script to close the new tab
//         var closeScript = event.source.close_script;
//         var scriptElement = document.createElement('script');
//         scriptElement.text = closeScript;
//         document.head.appendChild(scriptElement);
//     }
// });

// FtButton.addEventListener('click', async function(event){
//     fetch('/api/login_with_42/')
//     .then(response => response.json())
//     .then(data => {
//         // Call the function to open a new tab
//         openNewTab(data.script);
//     })
//     .catch(error => console.error('Error:', error));
// });


var closeScript = null;

function openNewTab(script) {
    var scriptElement = document.createElement('script');
    scriptElement.text = script;
    document.head.appendChild(scriptElement);
}

window.addEventListener('message', function(event) {
    console.log(event.data);
    if (event.data === 'logged_in') {
        // Execute the received script to close the new tab
        if (closeScript) {
            var scriptElement = document.createElement('script');
            scriptElement.text = closeScript;
            document.head.appendChild(scriptElement);
        }
    }
});

FtButton.addEventListener('click', async function(event){
    fetch('/api/login_with_42/')
    .then(response => response.json())
    .then(data => {
        closeScript = data.close_script;

        openNewTab(data.script);
    })
    .catch(error => console.error('Error:', error));
});
