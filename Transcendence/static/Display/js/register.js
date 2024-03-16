registerButton = document.querySelector('.registerBtn');

registerButton.addEventListener('click', async function(event){
    event.preventDefault();
    console.log(event);
    console.log(window.location.origin + '/api/register/');
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var first_name = document.getElementById("firstname").value;
    var last_name = document.getElementById("lastname").value;
    var password1 = document.getElementById("password1").value;
    var password2 = document.getElementById("password2").value;
    // Girilen şifrelerin eşleşip eşleşmediğini kontrol et
    if (password1 !== password2) {
        alert("Passwords do not match!");
        return;
    }
    if (username == 'Guest' || username == 'guest' || username == 'GUEST') {
        alert("Username cannot be Guest");
        return ;
    }


    // Form verilerini bir objeye yerleştir
    var formData = {
        username: username,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password1: password1,
        password2: password2,
    };

    // API'ye göndermek için fetch kullanarak POST isteği oluştur
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
        console.log(data);
        // alert(data[0]);
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
        // Başarılı kayıt işlemi sonrası yönlendirme veya diğer işlemler burada gerçekleştirilebilir
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Registration failed!");
    });
});