function getCookie(name) {
    const value = `; `;  
    const parts = document.cookie.split(value);
    for (let i = 0; i < parts.length; i++) {
        let part = parts[i].split('=');
        if (part.length === 2 && name === part[0]) {
            return `Bearer ${part[1]}`;
        }
    }
    return ""; // Cookie not found
}

let socket;
let endpoint;
let friendCurrentInvite = "";

document.addEventListener('DOMContentLoaded', async () => { 
    let loca = window.location;

    if (loca.protocol === 'https:') {
        wsStart = 'wss://';
    } else {
        wsStart = 'ws://';
    }
    
    endpoint = wsStart + loca.host + '/';
    socket = new WebSocket(endpoint);

    socket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        friendCurrentInvite = data.username;
        if (data.action === 'pongInvite' && data.friend === document.querySelector('.userName').id) {
            
            const options = {
                animation: true,
                delay: 15000,
            };
            const toast = new bootstrap.Toast(document.getElementById('EpicToast-invite'), options);
            toast.show();
        }
    }
    socket.onerror = function (e) {
        socket = new WebSocket(endpoint);
    }
});

function inviteAccepting() {

    const username = document.querySelector('.userName').id;

    if (friendCurrentInvite === "") {
        return;
    }

    socket.send(JSON.stringify({
        "action": 'pongInviteReturn',
        "username": friendCurrentInvite,
        "friend": username,
        "update": true
    }));
}

function redirectPage(url) {
    window.history.pushState({}, "", url);
    urlLocationHandler();
}

function replacePage(url) {
    window.history.replaceState({}, "", url);
    urlLocationHandler();
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
}

async function setLanguage()
{
    let headers = {};
    headers['Authorization'] = getCookie('access_token');
    
    const TmpUsername = await fetch(window.location.origin + '/' + "get-file/username", {
        headers: headers,
    }).then(response => response.text());
    
    let lan = await fetch(window.location.origin + "/api/profile/" + TmpUsername, {
        headers: headers,
    }).then(response => response.json());

    
    let newLang = lan['language'];

    if (newLang == "TR")
        naviTR();
    else if (newLang == "FR")
        naviFR();
    else
        naviEN();

    return (newLang);
}

let isRunning = false;
let sayac = 0;
let proInterval;
let language = "EN";

class IntervalHandler {
    constructor() {
        this.intervals = {
            "inv1": 0,
            "inv2": 0,
            "inv3": 0,
            "inv4": 0,
            "setTimeout": 0,
        }
    }
};
const intervalHandler = new IntervalHandler();



document.addEventListener('click', (e) => {
    const { target } = e;

    if (!target.matches("nav a")
        && !target.matches("#registerButtonInLoginPage") && !target.matches("#signInButtonInRegisterPage") // login -> register and register -> login navigation
        && !target.matches("#settingsGeneralButton")
    ) {
        return;
    }

    e.preventDefault();
    urlRoute(e);
});


const urlRoutes = {
    /* 404 Page */
    404: {
        url: "/404",
        endpoints: {
            0: "game/5",
        },
        title: "404",
        description: "",
    },

    /* Home Page */
    "/": {
        url: "/",
        endpoints: {
            0: "get-file/home/home.css",
        },
        title: "Home",
        description: "",
    },

    /* Logout TEST TMP TES TMP */
    "/logout": {
        url: "/logout",
        endpoints: {
            0: "/logout",
        },
        title: "",
        description: "",
    },
    /* 42 Login Page */
    "/ft_login": {
        url: "/ft_login",
        endpoints: {
            0: "get-file/ft_login/ft_login.html",
            1: "static/Display/css/ft_login.css",
            2: "static/Display/js/ft_login.js",
        },
        title: "42 Login",
        description: "",
    },
    /* Login Page */
    "/login": {
        url: "/login",
        endpoints: {
            0: "get-file/login/login.html",
            1: "static/Display/css/login.css",
            2: "static/Display/js/login.js",
        },
        title: "Login",
        description: "",
    },

    "/register": {
        url: "/register",
        endpoints: {
            0: "get-file/register/register.html",
            1: "static/Display/css/register.css",
            2: "static/Display/js/register.js",
        },
        title: "Register",
        description: "",
    },

    "/vs": {
        url: "/vs",
        endpoints: {
            0: "get-file/vs/vs.html",
            1: "static/Display/css/vs.css",
            2: "static/Display/js/vs.js",
        },
        title: "vsPage",
        description: "",
    },

    /* Profile Page */

    "/profile": {
        url: "",
        endpoints: {
            0: "get-file/profile/profile.html",
            1: "static/Display/css/profile.css",
            2: "static/Display/js/profile.js",
        },
        key: "",
        title: "Profile",
        description: "",
    },

    /* about page */
    "/about": {
        url: "/about",
        endpoints: {
            0: "get-file/about/about.html",
            1: "static/Display/css/about.css",
            2: "static/Display/js/about.js",
        },
        title: "about",
        description: "",
    },

    /* settings Page */
    "/settings": {
        url: "/settings",
        endpoints: {
            0: "get-file/settings/settings.html",
            1: "static/Display/css/settings.css",
            2: "static/Display/js/settings.js",
        },
        title: "Settings",
        description: "",
    },

    /* Game Page */
    "/play-pong": {
        url: "/play-pong",
        endpoints: {
            0: "game/1",
            1: "game/2"
        },
        title: "Pong Game",
        description: "",
    },

    /* Chat Page */
    "/chat": {
        url: "/chat",
        endpoints: {
            0: "get-file/chat/chat.html",
            1: "static/Chat/css/chat.css",
            2: "static/Chat/js/chat.js",
        },
        title: "Chat",
        description: "",
    },

    "/pong": {
        url: "/pong",
        endpoints: {
            0: "get-file/pong/pong.html",
            1: "static/Pong/css/pong.css",
            2: "static/Pong/js/pong.js",
        },
        title: "Pong",
        description: "",
    },

    "/tournament": {
        url: "/tournament",
        endpoints: {
            0: "get-file/tournament/tournament.html",
            1: "static/Display/css/tournament.css",
            2: "static/Display/js/tournament.js",
        },
        title: "tournament",
        description: "",
    },
};


const getLoginStat = async () => {
    const head = new Headers();
    head.append('Accept', 'application/json');
    let response = await fetch(window.location.origin + '/api/check/login/', {
        method: 'GET',
        headers: head,
    })
    if (!response.ok) {
        console.error("Error: no login status");
        return (false);
    }

    const user = await response.json();

    return (user.isLoggedIn);
}

const urlRoute = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    urlLocationHandler();
};

const loadPage = async (endpoints, url, key) => {
    const LoginState = await getLoginStat();

    clearInterval(proInterval);

    if (LoginState) {
        language = await setLanguage();
    }

    if (!LoginState && url == '/register') {
        loadRegister(endpoints);
        return (0);
    }
    else if (!LoginState && url.substring(0, 10) == "/ft_login/") {
        loadft_login(endpoints, key);
        return (0);
    }
    else if (LoginState && url == '/register') {
        window.history.replaceState({}, "", '/login');
        urlLocationHandler();
        return (0);
    }
    else if (!LoginState && url.substring(0, 6) == "/login") {
        loadLogin(endpoints);
        return (0);
    }
    else if (!LoginState && url != '/login') {
        window.history.replaceState({}, "", '/login');
        urlLocationHandler();
        return (0);
    }
    else if (LoginState && url == "/login") {
        window.history.replaceState({}, "", '/');
        urlLocationHandler();
        return (0);
    }
    else if (url == '/logout') {
        const head = new Headers();
        head.append('Authorization', getCookie('access_token'));
        data = await fetch(window.location.origin + '/logout', {
            method: 'GET',
            headers: head,
        });
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        deleteCookie("code42"); 
        deleteCookie("sessionid"); 
        window.history.replaceState({}, "", '/');
        urlLocationHandler();
        return (0);
    }
    else if (url == "/settings") {
        loadSettings(endpoints);
        return (0);
    }
    else if (url == "/profile") {

        loadProfile(endpoints);
        return (0);
    }
    else if (url == "/login") {
        loadLogin(endpoints);
        return (0);
    }
    else if (url == "/chat") {
        loadChat(endpoints);
        return (0);
    }
    else if (url == "/vsPage") {
        loadVsPage(endpoints);
        return (0);
    }
    else if (url == "/about") {
        loadAbout(endpoints);
        return (0);
    }
    else if (url == "/tournament") {
        loadTournament(endpoints);
        return (0);
    }
    else if (url == "/pong") {
        loadPong(endpoints);
        return (0);
    }

    const head = new Headers();
    head.append('Authorization', getCookie('access_token'));
    const html = await fetch(window.location.origin + '/' + endpoints[0], {
        headers: head,
    })
        .then(response => response.text());

    document.querySelector('.userName').id = await fetch(window.location.origin + '/' + "get-file/username").then(response => response.text());
    const app = document.getElementById("app");

    app.innerHTML = "";
    app.innerHTML = html;
};

const urlLocationHandler = async () => {
    let location = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    isRunning = false;
    if (location.substring(0, 10) == "/ft_login/") {
        document.cookie = `code42=${urlParams.get('code')}`;
        const route = urlRoutes['/ft_login'] || urlRoutes[404];
        document.title = route.title;
        loadPage(route.endpoints, location, urlParams);
        return (0);
    }
    else if (await getLoginStat() && location.substring(0, 8) == '/profile') {
        let username = location.substring(8, location.length);
        const route = urlRoutes['/profile'] || urlRoutes[404];
        if (username.length == 0) {
            const head = new Headers();
            head.append('Authorization', getCookie('access_token'));

            username = await fetch(window.location.origin + '/' + "get-file/username", {
                headers: head,
            })
                .then(response => response.text());
            window.history.replaceState({}, "", location + "/" + username);
            urlLocationHandler();
            return (0);
        }
        loadProfile(route.endpoints, username);
        return (0);
    }
    if (location.length == 0) {
        location = "/";
    }
    const route = urlRoutes[location] || urlRoutes[404];
    document.title = route.title;
    loadPage(route.endpoints, route.url);
};

async function loadProfile(endpoints, username) {
    const head = new Headers();
    head.append('Authorization', getCookie('access_token'));

    const profileHtml = await fetch(window.location.origin + '/' + endpoints[0], {
        headers: head,
    })
        .then(response => response.text());

    const profileCss = await fetch(window.location.origin + '/' + endpoints[1], {
        headers: head,
    })
        .then(response => response.text());

    let profileJs = await fetch(window.location.origin + '/' + endpoints[2], {
        headers: head,
    })
        .then(response => response.text());

    const app = document.getElementById('app');
    app.innerHTML = profileHtml;

    const style = document.createElement('style');
    style.appendChild(document.createTextNode(profileCss));

    const script = document.createElement('script');
    profileJs = profileJs.replaceAll("{{USERNAME}}", username);
    script.innerHTML = profileJs;

    app.appendChild(script);
    app.appendChild(style);
    delete style;
    delete script;
}

async function loadVsPage(endpoints) {

    const head = new Headers();
    head.append('Authorization', getCookie('access_token'));

    const profileHtml = await fetch(window.location.origin + '/' + endpoints[0], {
        headers: head,
    })
        .then(response => response.text());
    const profileCss = await fetch(window.location.origin + '/' + endpoints[1], {
        headers: head,
    })
        .then(response => response.text());
    const profileJs = await fetch(window.location.origin + '/' + endpoints[2], {
        headers: head,
    })
        .then(response => response.text());

    const app = document.getElementById('app');
    app.innerHTML = profileHtml;

    const style = document.createElement('style');
    style.appendChild(document.createTextNode(profileCss));

    const script = document.createElement('script');
    script.innerHTML = profileJs;

    app.appendChild(script);
    app.appendChild(style);
    delete style;
    delete script;
}


async function loadTournament(endpoints) {

    const head = new Headers();
    head.append('Authorization', getCookie('access_token'));

    const tournamentHtml = await fetch(window.location.origin + '/' + endpoints[0], {
        headers: head,
    })
        .then(response => response.text());

    const tournamentCss = await fetch(window.location.origin + '/' + endpoints[1], {
        headers: head,
    })
        .then(response => response.text());

    const tournamentJs = await fetch(window.location.origin + '/' + endpoints[2], {
        headers: head,
    })
        .then(response => response.text());

    const app = document.getElementById('app');
    app.innerHTML = tournamentHtml;

    const style = document.createElement('style');
    style.appendChild(document.createTextNode(tournamentCss));

    const script = document.createElement('script');
    script.innerHTML = tournamentJs;

    app.appendChild(script);
    app.appendChild(style);
    delete style;
    delete script;
}


async function loadSettings(endpoints) {

    const head = new Headers();
	head.append('Authorization', getCookie('access_token'));

    const settingsHtml = await fetch(window.location.origin + '/' + endpoints[0], {
        headers: head,
    })
        .then(response => response.text());
    const settingsCss = await fetch(window.location.origin + '/' + endpoints[1], {
        headers: head,
    })
        .then(response => response.text());
    const settingsJs = await fetch(window.location.origin + '/' + endpoints[2], {
        headers: head,
    })
        .then(response => response.text());

    const app = document.getElementById('app');
    app.innerHTML = settingsHtml;

    const style = document.createElement('style');
    style.appendChild(document.createTextNode(settingsCss));

    const script = document.createElement('script');
    script.innerHTML = settingsJs;

    app.appendChild(script);
    app.appendChild(style);
    delete script;
    delete style;
}


async function loadAbout(endpoints) {

    const head = new Headers();
	head.append('Authorization', getCookie('access_token'));
    const aboutHtml = await fetch(window.location.origin + '/' + endpoints[0], {
        headers: head,
    })
        .then(response => response.text());
    const aboutCss = await fetch(window.location.origin + '/' + endpoints[1], {
        headers: head,
    })
        .then(response => response.text());

    const app = document.getElementById('app');
    app.innerHTML = aboutHtml;

    const style = document.createElement('style');
    style.appendChild(document.createTextNode(aboutCss));

    app.appendChild(style);
    delete style;
}

async function loadPong(endpoints) {

    const head = new Headers();
	head.append('Authorization', getCookie('access_token'));

    const gameInterfaceHtml = await fetch(window.location.origin + '/' + endpoints[0], {
        headers: head,
    })
        .then(response => response.text());
    const gameInterfaceCss = await fetch(window.location.origin + '/' + endpoints[1], {
        headers: head,
    })
        .then(response => response.text());
    const gameInterfaceJs = await fetch(window.location.origin + '/' + endpoints[2], {
        headers: head,
    })
        .then(response => response.text());

    const app = document.getElementById('app');
    app.innerHTML = gameInterfaceHtml;

    const style = document.createElement('style');
    style.appendChild(document.createTextNode(gameInterfaceCss));

    const script = document.createElement('script');
    script.innerHTML = gameInterfaceJs;

    isRunning = true;
    app.appendChild(script);
    app.appendChild(style);
    delete script;
    delete style;
}

async function loadft_login(endpoints, url) {

    let loginJs = await fetch(window.location.origin + '/' + endpoints[2], {
        method: 'GET',
        headers: {
            'Content-type': 'text/javascript',
            'Authorization': getCookie('access_token'),
        }
    })
        .then(response => response.text());
    loginJs = loginJs.replaceAll("{URL}", url);

    const navi = document.getElementById('navigation');
    navi.setAttribute("hidden", "hidden");

    const app = document.getElementById('app');
    app.innerHTML = "<div id='loading-cont' class='d-flex justify-content-center'><div id='loading-img'  class='spinner-border text-warning' role='status'><span class='visually-hidden'>Loading...</span></div> <button style=' display: none;' id='redirectLogin' disabled>Redirect To our Website</button></div>";

    const script = document.createElement('script');
    script.innerHTML = loginJs;

    app.appendChild(script);
    delete script;



}


async function loadLogin(endpoints) {
    const loginHtml = await fetch(window.location.origin + '/' + endpoints[0], {
        method: 'GET',
        headers: {
            'Content-type': 'text/html',
            'Authorization': getCookie('access_token'),
        }
    })
        .then(response => response.text());

    const loginJs = await fetch(window.location.origin + '/' + endpoints[2], {
        method: 'GET',
        headers: {
            'Content-type': 'text/javascript',
            'Authorization': getCookie('access_token'),
        }
    })
        .then(response => response.text());

        var loginCss = await fetch(window.location.origin + '/' + endpoints[1], {
            method: 'GET',
            headers: {
                'Content-type': 'text/css',
                'Authorization': getCookie('access_token'),
        }
    })
        .then(response => response.text());


    const navi = document.getElementById('navigation');
    navi.setAttribute("hidden", "hidden");

    const app = document.getElementById('app');
    app.innerHTML = loginHtml;

    const style = document.createElement('style');
    style.appendChild(document.createTextNode(loginCss));

    const script = document.createElement('script');
    script.innerHTML = loginJs;

    app.appendChild(script);
    app.appendChild(style);
    delete script;
    delete style;
}

async function loadRegister(endpoints) {

    const loginHtml = await fetch(window.location.origin + '/' + endpoints[0], {
        method: 'GET',
        headers: {
            'Content-type': 'text/html',
            'Authorization': getCookie('access_token'),
        }
    })
    .then(response => response.text());
    
    const loginJs = await fetch(window.location.origin + '/' + endpoints[2], {
        method: 'GET',
        headers: {
            'Content-type': 'text/javascript',
            'Authorization': getCookie('access_token'),
        }
    })
    .then(response => response.text());
    
    var loginCss = await fetch(window.location.origin + '/' + endpoints[1], {
        method: 'GET',
        headers: {
            'Content-type': 'text/css',
            'Authorization': getCookie('access_token'),
        }
    })
        .then(response => response.text());


    const navi = document.getElementById('navigation');
    navi.setAttribute("hidden", "hidden");

    const app = document.getElementById('app');
    app.innerHTML = loginHtml;

    const style = document.createElement('style');
    style.appendChild(document.createTextNode(loginCss));

    const script = document.createElement('script');
    script.innerHTML = loginJs;

    app.appendChild(script);
    app.appendChild(style);
    delete script;
    delete style;
}

async function loadGame(endpoints) {
    const head = new Headers();
    head.append('Authorization', getCookie('access_token'));

    const gameHtml = await fetch(endpoints[0], {
        headers: head,
    })
        .then(response => response.text());
    const gameJs = await fetch(endpoints[1], {
        headers: head,
    })
        .then(response => response.text());

    const script = document.createElement('script');
    const app = document.getElementById('app');

    isRunning = true;
    app.innerHTML = await gameHtml;
    script.type = "module";
    script.innerHTML = gameJs;
    app.appendChild(script);
    delete script;
}

async function loadChat(endpoints) {
    const head = new Headers();
    head.append('Authorization', getCookie('access_token'));

    const chatHtml = await fetch(window.location.origin + '/' + endpoints[0], {
        headers: head,
    })
        .then(response => response.text());

    const chatCss = await fetch(window.location.origin + '/' + endpoints[1], {
        headers: head,
    })
        .then(response => response.text());

    const chatJs = await fetch(window.location.origin + '/' + endpoints[2], {
        headers: head,
    })
        .then(response => response.text());

    const app = document.getElementById('app');
    app.innerHTML = chatHtml;

    const style = document.createElement('style');
    style.appendChild(document.createTextNode(chatCss));

    const script = document.createElement('script');
    script.innerHTML = chatJs;

    app.appendChild(script);
    app.appendChild(style);
    delete script;
    delete style;
}
function naviTR()
{
    document.getElementById("navbarhomet").innerText = "Ana Sayfa";
    document.getElementById("navbarProText").innerText = "Profil";
    document.getElementById("navbarChatText").innerText = "Sohbet";
    document.getElementById("navbarGameText").innerText = "Oyun";
    document.getElementById("navbarSetText").innerText = "Ayarlar";
    document.getElementById("navbarAboutText").innerText = "Hakkında";
    document.getElementById("navbarLogoutText").innerText = "Çıkış";
}

function naviEN()
{
    document.getElementById("navbarhomet").innerText = "Home";
    document.getElementById("navbarProText").innerText = "Profile";
    document.getElementById("navbarChatText").innerText = "Chat";
    document.getElementById("navbarGameText").innerText = "Game";
    document.getElementById("navbarSetText").innerText = "Settings";
    document.getElementById("navbarAboutText").innerText = "About";
    document.getElementById("navbarLogoutText").innerText = "Logout";
}

function naviFR()
{

    document.getElementById("navbarhomet").innerText = "Accueil";
    document.getElementById("navbarProText").innerText = "Profil";
    document.getElementById("navbarChatText").innerText = "Chat";
    document.getElementById("navbarGameText").innerText = "Jeu";
    document.getElementById("navbarSetText").innerText = "Paramètres";
    document.getElementById("navbarAboutText").innerText = "À propos";
    document.getElementById("navbarLogoutText").innerText = "Déconnexion";
}

window.onpopstate = urlLocationHandler;
window.route = urlRoute;

urlLocationHandler();