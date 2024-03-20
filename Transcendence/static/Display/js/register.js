registerButton = document.querySelector('.registerBtn');

registerButton.addEventListener('click', async function(event){
    event.preventDefault();
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var first_name = document.getElementById("firstname").value;
    var last_name = document.getElementById("lastname").value;
    var password1 = document.getElementById("password1").value;
    var password2 = document.getElementById("password2").value;
    if (password1 !== password2) {
        alert("Passwords do not match!");
        return;
    }
    if (!/^([^\s@]+@[^\s@]+\.[^\s@]+)$/.test(email)) {
        alert("Invalid email!");
        return;
    }
    if (username == 'Guest' || username == 'guest' || username == 'GUEST') {
        alert("Username cannot be Guest");
        return ;
    }

    var formData = {
        username: username,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password1: password1,
        password2: password2,
    };

    fetch("/api/register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.text())
    .then(data => {
        data = JSON.parse(data);
        if (data["status"] === 201) {
            alert(data["message"]);
            redirectPage('/login');
        }
        else if (data["status"] === 400){
            if(data['message']['username'])
            {
                alert(data['message']['username']);
            }
            else
            {
                alert(data['message']['non_field_errors'])
            }
        }
        else {
            
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Registration failed!");
    });
});