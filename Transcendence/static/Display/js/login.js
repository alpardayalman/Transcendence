loginButton = document.getElementById('login_btn');

// handleLogin();

//let a = setInterval(handleLogin, 5000);
// async function handleLogin() {
//     if (document.cookie.includes('code42')) {
//       console.log("Dev js login: ", getCookie('code42'));
//         await fetch(window.location.origin + '/api/redirect_auth/', {
//           method: 'POST',
//           body: JSON.stringify({
//             'code': getCookie('code42'),
//           }),
//           headers: {
//             'Content-type': 'application/json',
//           },
//         })
//         .then(response => response.json())
//         .then(async json => {
//           const data = json;
//           console.log('dev js: 40', data['status']);
//           if (data['status'] === 200) {
//             console.log('logged in');

//             document.cookie = `access_token=${data['access_token'].access}`;
//             document.cookie = `refresh_token=${data['access_token'].refresh}`;
//             console.log("getLoginStat: ", getLoginStat());
//             // let loginstat = await getLoginStat();
//             // while (loginstat === false) {
//             //   console.log("HELLO WORLD");
//             //   loginstat = await getLoginStat();
//             //   continue ;
//             // }
//             // window.history.replaceState({}, "", '/');
//             // urlLocationHandler();
//             // console.log('dev js: 42access_token: ', getCookie('access_token'));
//           }
//           else if (data['status'] === 503)
//           {
//             // cookieleri silme islemi.
//             // Wrong Password
//             // deleteCookie(getCookie('code42'));
//             // deleteCookie(getCookie('refresh_token'));
//             // console.log("Wrong Password");
//           }
//         });
//       }
//    }

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
        document.cookie = `access_token=${data['access_token'].access}`;
        document.cookie = `refresh_token=${data['access_token'].refresh}`;

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


addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
        loginButton.click();
    }
});

FtButton.addEventListener('click', async function(event){
    fetch('/api/login_with_42/')
    .then(response => response.json())
    .then(data => {
      location.href = data.code;
      //document.cookie = "code42=" + data.code;
    })
    .catch(error => console.error('Error:', error));
});