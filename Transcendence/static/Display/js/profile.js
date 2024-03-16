console.log('profile.js loading');

async function doItBabi() {
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
    let status = profile['online_status'];
    
    const onlineStatusIndicator = document.getElementById('online-status');
    if (onlineStatusIndicator === null) {
        return;
    }
    if (status) {
        onlineStatusIndicator.style.backgroundColor = 'green';
    }
    else {
        onlineStatusIndicator.style.backgroundColor = 'red';
    }
    console.log(status);
}

async function getStatus() {
    while (1) {
        if (window.location.href !== window.location.origin + '/profile{{USERNAME}}') {
            return ;
        }
        await doItBabi();
        await new Promise(r => setTimeout(r, 2000));
    }
}

async function loading() {
	console.log('profile.js loaded');
    let headers = {};
    headers['Authorization'] = getCookie('access_token');
    let response = await fetch(window.location.origin + '/api/profile{{USERNAME}}', {
        headers: headers
    });
    
    if (!response.ok) {
        replacePage('/');
        alert('Error loading profile');
        return;
    }
    
    try {        
        let matchHistory = await fetch(window.location.origin + '/api/matchget{{USERNAME}}', {
            headers: headers
        });
        if (!matchHistory.ok) {
            alert('Error loading match history');
            return ;
        }
    
        let match = await matchHistory.json();
        console.log(match.data);
        match = JSON.parse(match.data);
        for (let i = 0; i < 5; i++)
        {
            let history = document.getElementById('match-history-' + (i + 1));
            history = history.querySelectorAll('.match-stats');
            if (match['UserOne-' + i] === undefined)
            {
                for (let j = 0; j < 5; j++)
                {
                    if (j === 2)
                        continue ;
                    history[j].innerText = "N/A";
                }
                continue;
            }
            history[0].innerText = (match['UserOne-' + i]);
            history[1].innerText = (match['ScoreOne-' + i]);
            history[4].innerText = (match['UserTwo-' + i]);
            history[3].innerText = (match['ScoreTwo-' + i]);
        }
    } catch (error) {
        console.log('error');
        for (let i = 0; i < 5; i++)
        {
            let history = document.getElementById('match-history-' + (i + 1));
            history = history.querySelectorAll('.match-stats');
            history[0].innerText = "N/A";
            history[1].innerText = "N/A";
            history[3].innerText = "N/A";
            history[4].innerText = "N/A";
        }
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
    const profileImage = document.getElementById('profileImage');
    profileImage.src = profile['profile_picture'];


    
    let scores = profile;
    let score = document.querySelector('#userScore');
    let scoreBoard = score.querySelectorAll('.text-secondary');
    scoreBoard[0].innerText = scores['total_match'];
    scoreBoard[1].innerText = scores['win'];
    scoreBoard[2].innerText = scores['lose'];
    getStatus();
    // proInterval = setInterval(doItBabi(), 6000);
}


loading();