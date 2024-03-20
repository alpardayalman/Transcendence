
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
            history[5].innerText = (match['Date-' + i])
        }
    } catch (error) {
        for (let i = 0; i < 5; i++)
        {
            let history = document.getElementById('match-history-' + (i + 1));
            history = history.querySelectorAll('.match-stats');
            history[0].innerText = "N/A";
            history[1].innerText = "N/A";
            history[3].innerText = "N/A";
            history[4].innerText = "N/A";
            history[5].innerText = "N/A";
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
}

function profileEN()
{
    document.getElementById('profile-lose').innerText = "Lose";
    document.getElementById('profile-win').innerText = "Win";
    document.getElementById('profile-total-match').innerText = "Total Match";
    document.getElementById('profile-loading-1').innerText = "Loading...";
    document.getElementById('profile-loading-2').innerText = "Loading...";
    document.getElementById('profile-loading-3').innerText = "Loading...";
    document.getElementById('profile-username').innerText = "Username";
    document.getElementById('profile-email').innerText = "Email";
    document.getElementById('profile-firstname').innerText = "Firstname";
    document.getElementById('profile-lastname').innerText = "Lastname";
    document.getElementById('profile-bio').innerText = "Bio";
    document.getElementById("profile-hs-score1").innerText = "Score";
    document.getElementById("profile-hs-user1").innerText = "User";
    document.getElementById("profile-hs-score2").innerText = "Score";
    document.getElementById("profile-hs-user2").innerText = "User";
    document.getElementById("profile-hs-date").innerText = "Date";
}

function profileTR() {
    document.getElementById('profile-lose').innerText = "Kaybet";
    document.getElementById('profile-win').innerText = "Kazan";
    document.getElementById('profile-total-match').innerText = "Toplam Maç";
    document.getElementById('profile-loading-1').innerText = "Yükleniyor...";
    document.getElementById('profile-loading-2').innerText = "Yükleniyor...";
    document.getElementById('profile-loading-3').innerText = "Yükleniyor...";
    document.getElementById('profile-username').innerText = "Kullanıcı Adı";
    document.getElementById('profile-email').innerText = "E-posta";
    document.getElementById('profile-firstname').innerText = "Ad";
    document.getElementById('profile-lastname').innerText = "Soyad";
    document.getElementById('profile-bio').innerText = "Biyografi";
    document.getElementById("profile-hs-score1").innerText = "Skor";
    document.getElementById("profile-hs-user1").innerText = "Kullanıcı";
    document.getElementById("profile-hs-score2").innerText = "Skor";
    document.getElementById("profile-hs-user2").innerText = "Kullanıcı";
    document.getElementById("profile-hs-date").innerText = "Tarih";
}

function profileFR() {
    document.getElementById('profile-lose').innerText = "Perdre";
    document.getElementById('profile-win').innerText = "Gagner";
    document.getElementById('profile-total-match').innerText = "Correspondance totale";
    document.getElementById('profile-loading-1').innerText = "Chargement...";
    document.getElementById('profile-loading-2').innerText = "Chargement...";
    document.getElementById('profile-loading-3').innerText = "Chargement...";
    document.getElementById('profile-username').innerText = "Nom d'utilisateur";
    document.getElementById('profile-email').innerText = "Email";
    document.getElementById('profile-firstname').innerText = "Prénom";
    document.getElementById('profile-lastname').innerText = "Nom";
    document.getElementById('profile-bio').innerText = "Biographie";
    document.getElementById("profile-hs-score1").innerText = "Score";
    document.getElementById("profile-hs-user1").innerText = "Utilisateur";
    document.getElementById("profile-hs-score2").innerText = "Score";
    document.getElementById("profile-hs-user2").innerText = "Utilisateur";
    document.getElementById("profile-hs-date").innerText = "Date";
}

if (language == "TR")
    profileTR();
else if (language == "EN")
    profileEN();
else
    profileFR();

loading();