console.log('profile.js loaded');
document.title = 'Profile';

document.addEventListener('DOMContentLoaded', loading);
window.addEventListener('popstate', loading);

loading();

async function loading() {
    console.log('profile.js loading');
    let response = await fetch(window.location.origin + '/api/profile/', {});
    if (!response.ok) {
        alert('Error loading profile');
        return;
    }
    let json = await response.json();
    profile = json.data[0];
    let card = document.getElementById('card-inner')
    console.log(json.data[0]);
    let inner = card.querySelectorAll('.col-sm-9');
    inner[0].innerText = profile['username'];
    inner[1].innerText = profile['email'];
    inner[2].innerText = profile['first_name'];
    inner[3].innerText = profile['last_name'];
    inner[4].innerText = profile['is_active'];
}
