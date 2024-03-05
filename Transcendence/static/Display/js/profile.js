console.log('profile.js loading');

async function loading() {
	console.log('profile.js loaded');
    let headers = {};
    headers['Authorization'] = getCookie('access_token');
    let response = await fetch(window.location.origin + '/api/profile{{USERNAME}}', {
        headers: headers
    });
    if (!response.ok) {
        alert('Error loading profile');
        return;
    }
    let profile = await response.json();
    let card = document.getElementById('card-inner');
    card = card.querySelectorAll('.col-sm-9');
    card[0].innerText = profile['username'];
    card[1].innerText = profile['email'];
    card[2].innerText = profile['first_name'];
    card[3].innerText = profile['last_name'];
    card[4].innerText = profile['bio'];
    card = document.querySelector('#myusercard');
    card.querySelector('#user').innerText = profile['username'];

    let scores = profile;
    let score = document.querySelector('#userScore');
    let scoreBoard = score.querySelectorAll('.text-secondary');
    scoreBoard[0].innerText = scores['total_match'];
    scoreBoard[1].innerText = scores['win'];
    scoreBoard[2].innerText = scores['lose'];
    scoreBoard[3].innerText = scores['draw'];
    scoreBoard[4].innerText = scores['best_score'];
}

loading();