console.log("settings.js loaded");

loadingSettings();


async function loadingSettings() {
    console.log("settings.js loading");
    let inputField = document.querySelector(".username");
    console.log(inputField.value);
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
}

async function updateUser(firstName, lastName, email) {
    const url = "YOUR_API_URL"; // Replace with your actual API endpoint

    const data = {
        first_name: firstName,
        last_name: lastName,
        email: email,
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
            console.error("Error updating user profile:", await response.text());
            // Handle errors (e.g., display error message)
        }
    } catch (error) {
        console.error("Error:", error);
        // Handle other errors (e.g., network issues)
    }
}

// Example usage:

const saveButton = document.getElementById("SettingsButtonSave"); // Assuming the save button

saveButton.addEventListener("click", () => {
    const firstName = document.querySelector(".first_name").value;
    const lastName = document.querySelector(".last_name").value;
    const email = document.querySelector(".useremail").value;

    updateUser(firstName, lastName, email);
});



