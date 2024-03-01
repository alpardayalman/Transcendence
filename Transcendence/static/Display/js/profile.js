console.log('profile.js loading');

async function loading() {
	console.log('profile.js loaded');
    let headers = {};
    headers['Authorization'] = getCookie('access_token');

    let response = await fetch(window.location.origin + '/api/profile/', {
        method: 'GET',
        headers: headers
    });
    if (!response.ok) {
        alert('Error loading profile');
        return;
    }
    let profile = await response.json();
    profile = profile[0];
    let card = document.getElementById('card-inner');
    card = card.querySelectorAll('.col-sm-9');
    console.log(profile);
    card[0].innerText = profile['username'];
    card[1].innerText = profile['email'];
    card[2].innerText = profile['first_name'];
    card[3].innerText = profile['last_name'];
    card = document.querySelector('#myusercard');
    card.querySelector('#user').innerText = profile['username'];
    loadScore();
}

async function loadScore() {
    console.log('loading scores');
    let response = await fetch(window.location.origin + '/api/score/', {});
    if (!response.ok) {
        console.error('Error loading scores');
        return;
    }
    let scores = await response.json();
    scores = scores[0];
    let score = document.querySelector('#userScore');
    let scoreBoard = score.querySelectorAll('.text-secondary');
    scoreBoard[0].innerText = scores['total_match'];
    scoreBoard[1].innerText = scores['win'];
    scoreBoard[2].innerText = scores['lose'];
    scoreBoard[3].innerText = scores['draw'];
    scoreBoard[4].innerText = scores['best_score'];
}

loading();