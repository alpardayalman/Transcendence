loginButton = document.getElementById('login_btn');

handleLogin();

async function handleLogin() {
    if (document.cookie.includes('code42')) {
      console.log("Dev js login: ", getCookie('code42'));
   
      try {
        const response = await fetch(window.location.origin + '/api/redirect_auth/', {
          method: 'POST',
          body: JSON.stringify({
            'code': getCookie('code42'),
          }),
          headers: {
            'Content-type': 'application/json',
          },
        })
        .catch(err => console.log('Error: ', err));
        const data = await response.json();
        console.log('dev js: 40', data['status']);
        if (data['status'] === 200) {
          console.log('logged in');
          // window.stop();
   
          // window.history.replaceState({}, "", '/');
          document.cookie = `access_token=${data['access_token'].access}`;
          document.cookie = `refresh_token=${data['access_token'].refresh}`;
          console.log('dev js: 42access_token: ', getCookie('access_token'));
          const navi = document.getElementById('navigation');
          navi.removeAttribute("hidden");
          urlRoute(event);
        }
        else if (response.status === 400)
        {
          // Wrong Password
          console.log("Wrong Password");
        }
      } catch (err) {
        console.error('Error: ', err);
      }
    }
   }

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
        window.location.href = data.code;
    })
    .catch(error => console.error('Error:', error));
});
