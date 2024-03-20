
loadingSettings();

function FRlangueSET() {
    document.getElementById("usernameText").innerText = "Nom d'utilisateur";
    document.getElementById("firstnameText").innerText = "Prénom";
    document.getElementById("lastnameText").innerText = "Nom de famille";
    document.getElementById("emailText").innerText = "E-mail";
    document.getElementById("bioText").innerText = "Biographie";
    document.getElementById("SettingsButtonSave").innerText = "Enregistrer";
    document.getElementById("TwofaButtonActivate").innerText = "2FA";
    document.getElementById("settings-upload").innerText = "Télécharger";
    document.getElementById("DeleteUser").innerText = "Supprimer l'utilisateur";

}

function TRlangueSET() {
    document.getElementById("usernameText").innerText = "Kullanıcı Adı";
    document.getElementById("firstnameText").innerText = "Ad";
    document.getElementById("lastnameText").innerText = "Soyad";
    document.getElementById("emailText").innerText = "E-posta";
    document.getElementById("bioText").innerText = "Biyografi";
    document.getElementById("SettingsButtonSave").innerText = "Kaydet";
    document.getElementById("TwofaButtonActivate").innerText = "2FA";
    document.getElementById("settings-upload").innerText = "Yükle";
    document.getElementById("DeleteUser").innerText = "Kullanıcıyı Sil";
}

if (language == "TR")
{
    document.getElementById("TR").disabled = true;
    TRlangueSET();
}
else if (language == "FR")
{
    document.getElementById("FR").disabled = true;
    FRlangueSET();
}
else
{
    document.getElementById("EN").disabled = true;
}


async function loadingSettings() {
    let inputField = document.querySelector(".username");
    let headers = {};
    headers['Authorization'] = getCookie('access_token');
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
        const button = document.getElementById('TwofaButtonActivate');
        button.innerText = 'Disable 2Fa';
        button.style.color = 'black';
        button.style.background = 'red';
        button.style.border = '1px solid black';
    }
    
}

async function updateUser(firstName, lastName, email, bio, language) {

    const data = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        bio: bio,
        language: language
    };
    let inputField = document.querySelector(".username");
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
            alert("Profile updated successfully");
        } else {
            alert("Error updating profile");
        }
    } catch (error) {
        console.error("Error:", error);
    }
    const ratioRadioButtons = document.querySelectorAll('input[type="radio"][name="flexRadioDefault"]');

    // Check which radio button is checked (if any)
    let selectedRatio;
    for (const radioButton of ratioRadioButtons) {
        if (radioButton.checked) {
            selectedRatio = radioButton.value;
            break; // Exit the loop once a selection is found
        }
    }

    if (selectedRatio) {

    } else {

    }
}

function changeLanguage(buttonID) {
    const lang = document.getElementById(buttonID);
    lang.disabled = true;
    if (lang.innerText === "EN") {
        document.getElementById("TR").disabled = false;
        document.getElementById("FR").disabled = false;
    } else if (lang.innerText === "FR") {
        document.getElementById("EN").disabled = false;
        document.getElementById("TR").disabled = false;
    } else {
        document.getElementById("EN").disabled = false;
        document.getElementById("FR").disabled = false;
    }
}

document.getElementById("SettingsButtonSave").addEventListener("click", () => {
    const firstName = document.querySelector(".first_name").value;
    const lastName = document.querySelector(".last_name").value;
    const email = document.querySelector(".useremail").value;
    const bio = document.querySelector(".bio").value;
    let lang = "EN";
    if (document.getElementById("EN").disabled === true) {
        lang = "EN";
    } else if (document.getElementById("FR").disabled === true) {
        lang = "FR";
    } else {
        lang = "TR";
    }
    updateUser(firstName, lastName, email, bio, lang);
    redirectPage('/settings');
});

document.getElementById("DeleteUser").addEventListener("click", () => {
    let inputField = document.querySelector(".username");
    let headers = {};
    headers['Authorization'] = getCookie('access_token');
    fetch(window.location.origin + "/api/delete/" + inputField.value , {
        method: "DELETE",
        headers: {
            "Authorization": headers['Authorization']
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 204) {
            deleteCookie("access_token");
            deleteCookie("refresh_token");
            deleteCookie("code42");
            alert("Your account has been deleted");
            replacePage('/login');
        }
        else if (data.status === 404){
            alert("No Such User");
        }
    })
    .catch(error => console.error('Error:', error));
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
            if (data.status === 200) {
                const button = document.getElementById('TwofaButtonActivate');
                button.innerText = 'Enable 2FA';
                button.style.color = '';
                button.style.background = '';
                button.style.border = '';
            }
        });

}


document.getElementById("profile-picture-form").addEventListener("submit", function (event) {
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
    replacePage('/settings');
});