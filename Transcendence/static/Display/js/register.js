/* registerButton = document.querySelector('.registerButton');

registerButton.addEventListener('click', async function(event){
    // event.preventDefault();
    console.log(event);
    console.log(window.location.origin + '/api/register/');
    var response = await fetch(window.location.origin + '/api/register/', {
        method: 'POST',
        body: JSON.stringify({
            'username': username,
            'password': password
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    var data = await response.json();
    if (data['status'] === 200) {
        console.log('logged in');
        // load home page

    

    }
}); */

registerButton = document.querySelector('.registerBtn');

registerButton.addEventListener('click', async function(event){
    // event.preventDefault();
    console.log(event);
    console.log(window.location.origin + '/api/register/');
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password1 = document.getElementById("password1").value;
    var password2 = document.getElementById("password2").value;

    // Girilen şifrelerin eşleşip eşleşmediğini kontrol et
    if (password1 !== password2) {
        alert("Passwords do not match!");
        return;
    }

    // Form verilerini bir objeye yerleştir
    var formData = {
        username: username,
        email: email,
        password: password1
    };

    // API'ye göndermek için fetch kullanarak POST isteği oluştur
    fetch("your_api_endpoint_here", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Success:", data);
        alert("Registration successful!");
        // Başarılı kayıt işlemi sonrası yönlendirme veya diğer işlemler burada gerçekleştirilebilir
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Registration failed!");
    });
    var response = await fetch(window.location.origin + '/api/register/', {
        method: 'POST',
        body: JSON.stringify({
            'username': username,
            'password': password
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
    var data = await response.json();
    if (data['status'] === 200) {
        console.log('logged in');
        // load home page
    }
});