console.log("settings.js loaded");

loadingSettings();

ENlangue();
FRlangue();

function FRlangue (){
    document.getElementById("usernameText").innerText = "Nom d'utilisateur";
    document.getElementById("firstnameText").innerText = "Prénom";
    document.getElementById("lastnameText").innerText = "Nom de famille";
    document.getElementById("emailText").innerText = "E-mail";
    document.getElementById("bioText").innerText = "Biographie";
    document.getElementById("SettingsButtonSave").innerText = "Enregistrer";
    document.getElementById("TwofaButtonActivate").innerText = "2FA";

}

function ENlangue (){
    document.getElementById("usernameText").innerText = "Kullanıcı Adı";
    document.getElementById("firstnameText").innerText = "Ad";
    document.getElementById("lastnameText").innerText = "Soyad";
    document.getElementById("emailText").innerText = "E-posta";
    document.getElementById("bioText").innerText = "Biyografi";
    document.getElementById("SettingsButtonSave").innerText = "Kaydet";
    document.getElementById("TwofaButtonActivate").innerText = "2FA";
}


async function loadingSettings() {
    console.log("settings.js loading");
    let inputField = document.querySelector(".username");
    console.log(inputField.value);
    let headers = {};
    headers['Authorization'] = getCookie('access_token'); 
    console.log("USERNAME =========== " + inputField.value);
    let response = await fetch(window.location.origin + "/api/profile/" + inputField.value, {
        headers: headers
    });

    let pro = await response.json();
    pro = pro;

    let inputField2 = document.querySelector(".useremail");
    inputField2.value = pro["email"];
    let inputField3 = document.querySelector(".first_name");
    inputField3.value = pro["first_name"];
    let inputField4 = document.querySelector(".last_name");
    inputField4.value = pro["last_name"];
    let inputField5 = document.querySelector(".bio");
    inputField5.value = pro["bio"];

    if (pro["is_2fa_enabled"] == true) {
        console.log("2FA already enabled");
        const button = document.getElementById('TwofaButtonActivate');
        button.innerText = 'Disable 2Fa';
        button.style.color = 'black';
        button.style.background = 'red';
        button.style.border = '1px solid black';
    }
}

async function updateUser(firstName, lastName, email, bio) {

    const data = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        bio: bio,
    };
    console.log("settings.js loading");
    let inputField = document.querySelector(".username");
    console.log(inputField.value);
    let headers = {};
    headers['Authorization'] = getCookie('access_token');

    try {
        const response = await fetch(window.location.origin + "/api/profile/" + inputField.value + '/edit/', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": headers['Authorization']
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log("User profile updated successfully.");
            // Handle successful update (e.g., display success message)
        } else {
            console.error("Error updating user profile:");
            // Handle errors (e.g., display error message)
        }
    } catch (error) {
        console.error("Error:", error);
        // Handle other errors (e.g., network issues)
    }
}

document.getElementById("SettingsButtonSave").addEventListener("click", () => {
    const firstName = document.querySelector(".first_name").value;
    const lastName = document.querySelector(".last_name").value;
    const email = document.querySelector(".useremail").value;
    const bio = document.querySelector(".bio").value;
    updateUser(firstName, lastName, email, bio);
});


document.getElementById("TwofaButtonActivate").addEventListener("click", async () => {
    let headers = {};
    headers['Authorization'] = getCookie('access_token');
    const response = await fetch(window.location.origin + '/api/enable-2fa/', {
        method: "GET",
        headers: {
            "Authorization": headers['Authorization']
        },
    })
    .then(response => response.json())
    .then(data => {
        var qrImage = new Image();
        if (data.qr_image !== "exists") {
            qrImage.src = 'data:image/png;base64,' + data.qr_image;
            document.getElementById('qrcode-container').appendChild(qrImage);
            const element = document.getElementById('TwofaButtonActivate');
            element.style.display = 'none';
        }
        else {
            Disable2FA();
        }
    });
});


async function Disable2FA() {
    let headers = {};
    headers['Authorization'] = getCookie('access_token');
    const response = await fetch(window.location.origin + '/api/disable-2fa/', {
        method: "GET",
        headers: {
            "Authorization": headers['Authorization']
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.status === 200) {
            console.log("2FA disabled");
            const button = document.getElementById('TwofaButtonActivate');
            button.innerText = 'Enable 2FA';
            button.style.color = '';
            button.style.background = '';
            button.style.border = '';
        }
    });

}


document.getElementById("profile-picture-form").addEventListener("submit", function(event) {
    event.preventDefault();
    let inputField = document.querySelector(".username");
    var formData = new FormData(this);
    let headers = {};
    headers['Authorization'] = getCookie('access_token');
    
    fetch(window.location.origin + "/api/profile/" + inputField.value + '/edit/', {
        method: "PUT",
        body: formData,
        headers: {
            "Authorization": headers['Authorization']
        }
    })
    .then(response => response.json())
    .then(data => {
        // handle response, e.g., display uploaded image
        replacePage('/settings');
    })
    .catch(error => console.error('Error:', error));

});