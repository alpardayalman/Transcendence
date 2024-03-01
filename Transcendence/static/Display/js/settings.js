console.log("settings.js loaded");

loading();

async function loading() {
  console.log("settings.js loading");
  let headers = {};
  headers["Authorization"] = getCookie("access_token");
  console.log("anamm",headers);
  let response = await fetch(window.location.origin + "/api/profile/", {
    method: 'GET',
    headers: headers,
  });
  if (!response.ok) {
    alert("Error loading profile");
    return;
  }

  let pro = await response.json();
  pro = pro[0];

  // `card-body` içindeki `.form-group` elementlerini seçme

  // İlgili `input` elementinin value değerini profile'dan alınan değerle değiştirme
  let inputField = document.querySelector(".username");
  inputField.value = pro["username"];
  let inputField2 = document.querySelector(".useremail");
  inputField2.value = pro["email"];
  let inputField3 = document.querySelector(".first_name");
  inputField3.value = pro["first_name"];
  let inputField4 = document.querySelector(".last_name");
  inputField4.value = pro["last_name"];


}

function changeColor(event) {
  var items = document.querySelectorAll(".list-group-item");
  items.forEach(function (item) {
    item.classList.remove("active");
  });
  event.target.classList.add("active");
}
// Şifre değiştirme işlemini gerçekleştiren JavaScript kodu
/* async function changePassword() {
    var oldPassword = document.getElementById("oldPassword").value;
    var newPassword = document.getElementById("newPassword").value;
    var confirmNewPassword = document.getElementById("confirmNewPassword").value;

    // Girilen yeni şifrelerin eşleşip eşleşmediğini kontrol et
    if (newPassword !== confirmNewPassword) {
        alert("New passwords do not match!");
        return;
    }

    // Form verilerini bir objeye yerleştir
    var formData = {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
    };

    try {
        // API'ye POST isteği göndererek şifre değiştirme işlemini gerçekleştir
        var response = await fetch("/api/change-password/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"), // Django CSRF token'ı
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert("Password changed successfully!");
            // Başarılı işlem sonrası gerekli yönlendirme veya işlemler burada yapılabilir
        } else {
            throw new Error("Failed to change password");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Password change failed!");
    }
} */

// CSRF token'ı almak için kullanılan yardımcı fonksiyon
/* function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue; */
// }








// function showGeneralContent() {
//   document.getElementById("tabContent").innerHTML = `
//             <div class="card-body media align-items-center">
//                 <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="" class="d-block ui-w-80">
//                 <div class="media-body ml-4">
//                     <label class="btn btn-outline-primary">
//                         Upload new photo
//                         <input type="file" class="account-settings-fileinput">
//                     </label> &nbsp;
//                     <button type="button" class="btn btn-default md-btn-flat">Reset</button>
//                     <div class="text-light small mt-1">Allowed JPG, GIF or PNG. Max size of 800K</div>
//                 </div>
//             </div>
//             <hr class="border-light m-0">
//             <div class="card-body">
//             <div class="form-group">
//             <label class="form-label ">Username</label>
//             <input id="FormUser" type="text" class="form-control mb-1 username" value="">
//         </div>
//         <div class="form-group">
//             <label  class="form-label">firstname</label>
//             <input type="text" class="form-control first_name" value="">
//         </div>
//         <div class="form-group">
//             <label  class="form-label">lastname</label>
//             <input type="text" class="form-control last_name" value="">
//         </div>
//         <div class="form-group">
//             <label  class="form-label">email</label>
//             <input type="text" class="form-control useremail" value="">
//         </div>
//         <div class="form-group">
//             <div class="text-right mt-3">
//                 <button type="submit" class="btn btn-primary">Save changes</button>&nbsp;
//               </div>
//         </div>
//               </div>

// </div>
//     `;
// }

// function showPasswordContent() {
//   document.getElementById("tabContent").innerHTML = `
//     <form id="changePasswordForm">
//     <div class="card-body pb-2">
//         <div class="form-group">
//             <label class="form-label" for="oldPassword">Old Password</label>
//             <input id="oldPassword" type="password" class="form-control" name="currentPassword">
//         </div>
//         <div class="form-group">
//             <label for="newPassword" class="form-label">New password</label>
//             <input id="newPassword" type="password" class="form-control" name="newPassword">
//         </div>
//         <div class="form-group">
//             <label for="confirmNewPassword" class="form-label">Repeat new password</label>
//             <input id="confirmNewPassword" type="password" class="form-control" name="repeatPassword">
//         </div>
//         <div class="text-right mt-3">
//             <button type="" onclick="changePassword()" id="paswordButton" class="btn btn-primary">Save changes</button>&nbsp;
//         </div>
//     </div>
// </form>
//         `;
// }
// function showTwoContent() {
//   document.getElementById("tabContent").innerHTML = `
// <div class="form-group" style = "margin-top: 10px;">
//   <label for="languageSelect">Language:</label>
//   <select id="languageSelect" class="form-control">
//     <option value="tr">Türkçe</option>
//     <option value="en">English</option>
//     <option value="fr">Français</option>
//   </select>
// </div>
// <div class="form-group" id = "twa">
//   <label class="switcher">
//     <input type="checkbox" class="switcher-input" checked="">
//     <span class="switcher-indicator">
//       <span class="switcher-yes"></span>
//       <span class="switcher-no"></span>
//     </span>
//     <span class="switcher-label">twa</span>
//   </label>
// </div>
// <div class="text-right mt-3">
//             <button type="button" class="btn btn-primary">Save changes</button>&nbsp;
//             <button type="button" class="btn btn-default">Cancel</button>
//         </div>
//     `;
// }
