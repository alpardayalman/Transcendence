console.log('settings.js loaded');

loading();

/* async function loading() {
    console.log('profile.js loading');
    let response = await fetch(window.location.origin + '/api/profile/', {});
    if (!response.ok) {
        alert('Error loading profile');
        return;
    }
    
    
    let json = await response.json();
    profile = json.data[0];
    let Dcard = document.getElementById('general');
    console.log(json.data[0]);
    let Dinner = Dcard.querySelectorAll('.form-group');
    Dinner[0].innerText = profile['username'];
    Dinner[1].innerText = profile['email'];
    Dinner[2].innerText = profile['first_name'];
    Dinner[3].innerText = profile['last_name'];
    Dinner[4].innerText = profile['is_active'];
}
 */
async function loading() {
    console.log('settings.js loading');
    let response = await fetch(window.location.origin + '/api/profile/', {});
    if (!response.ok) {
        alert('Error loading profile');
        return;
    }
    
    let pro = await response.json();
	pro = pro[0];
    
    // `card-body` içindeki `.form-group` elementlerini seçme
    let formGroups = document.querySelectorAll('.card-body .form-group');
    
    // Her bir `.form-group` elementi için işlem yapma
    formGroups.forEach(function(formGroup) {
        // `.form-group` içindeki `input` elementlerini seçme
        let inputElement = formGroup.querySelector('input');
        
        // İlgili `input` elementinin value değerini profile'dan alınan değerle değiştirme
        let label = formGroup.querySelector('.form-label').innerText.trim().toLowerCase();
        switch (label) {
            case 'username':
                inputElement.value = pro['username'];
                break;
            case 'name':
                inputElement.value = pro['name'];
                break;
            case 'e-mail':
                inputElement.value = pro['email'];
                break;
            default:
                break;
        }
    });
}


function showGeneralContent() {
    document.getElementById('tabContent').innerHTML = `
        
            <div class="card-body media align-items-center">
                <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="" class="d-block ui-w-80">
                <div class="media-body ml-4">
                    <label class="btn btn-outline-primary">
                        Upload new photo
                        <input type="file" class="account-settings-fileinput">
                    </label> &nbsp;
                    <button type="button" class="btn btn-default md-btn-flat">Reset</button>
                    <div class="text-light small mt-1">Allowed JPG, GIF or PNG. Max size of 800K</div>
                </div>
            </div>
            <hr class="border-light m-0">
            <div class="card-body">
                <div class="form-group">
                    <label class="form-label">Username</label>
                    <input type="text" class="form-control mb-1" value="nmaxwell">
                </div>
                <div class="form-group">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" value="Nelle Maxwell">
                </div>
                <div class="form-group">
                    <label class="form-label">E-mail</label>
                    <input type="text" class="form-control mb-1" value="nmaxwell@mail.com">
                    <div class="alert alert-warning mt-3">
                        Your email is not confirmed. Please check your inbox.<br>
                        <a href="javascript:void(0)">Resend confirmation</a>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Company</label>
                    <input type="text" class="form-control" value="Company Ltd.">
                </div>
                <div class="text-right mt-3">
                <button type="button" class="btn btn-primary">Save changes</button>&nbsp;
                <button type="button" class="btn btn-default">Cancel</button>
              </div>

</div>
    `;
}

function showPasswordContent() {
    document.getElementById('tabContent').innerHTML = `
    <form id="myForm">
    <div class="card-body pb-2">
        <div class="form-group">
            <label class="form-label">Current password</label>
            <input type="password" class="form-control" name="currentPassword">
        </div>
        <div class="form-group">
            <label class="form-label">New password</label>
            <input type="password" class="form-control" name="newPassword">
        </div>
        <div class="form-group">
            <label class="form-label">Repeat new password</label>
            <input type="password" class="form-control" name="repeatPassword">
        </div>
        <div class="text-right mt-3">
            <button type="button" class="btn btn-primary">Save changes</button>&nbsp;
            <button type="button" class="btn btn-default">Cancel</button>
        </div>
    </div>
</form>
        `;
}
function showTwoContent() {
    document.getElementById('tabContent').innerHTML = `
<div class="form-group">
  <label class="switcher">
    <input type="checkbox" class="switcher-input" checked="">
    <span class="switcher-indicator">
      <span class="switcher-yes"></span>
      <span class="switcher-no"></span>
    </span>
    <span class="switcher-label">News and announcements</span>
  </label>
</div>
<div class="form-group">
  <label for="languageSelect">Language:</label>
  <select id="languageSelect" class="form-control">
    <option value="tr">Türkçe</option>
    <option value="en">English</option>
    <option value="fr">Français</option>
  </select>
</div>
<div class="text-right mt-3">
            <button type="button" class="btn btn-primary">Save changes</button>&nbsp;
            <button type="button" class="btn btn-default">Cancel</button>
        </div>
    `;
}