function getCookie(name) {
    const value = `; `;  // Add separator for easier splitting
    const parts = document.cookie.split(value);
    for (let i = 0; i < parts.length; i++) {
      let part = parts[i].split('=');
      if (part.length === 2 && name === part[0]) {
        return `Bearer ${part[1]}`;
      }
    }
    return ""; // Cookie not found
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


document.addEventListener('click', (e) => {
    const {target} = e;

    if (!target.matches("nav a") 
        && !target.matches("#registerButtonInLoginPage") && !target.matches("#signInButtonInRegisterPage") // login -> register and register -> login navigation
        && !target.matches("#settingsGeneralButton") && !target.matches("#settingsChangePasswordButton") && !target.matches("#settings2FaButton")
    )
    {
        console.log("Dev: Didn't match 'nav a' ");
        console.log("Dev: Or it's not a sap button");
        return ;
    }

    e.preventDefault();
    urlRoute(e);
});

let isRunning = false;

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
    "/logout" : {
        url: "/logout",
        endpoints: {
            0: "/logout",
        },
        title: "",
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
        url: "/profile",
        endpoints: {
            0: "get-file/profile/profile.html",
			1: "static/Display/css/profile.css",
			2: "static/Display/js/profile.js",
        },
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

    "/settings_2fa": {
        url: "/settings_2fa",
        endpoints: {
            0: "get-file/settings_2fa/settings_2fa.html",
            1: "static/Display/css/settings.css",
            2: "static/Display/js/settings_2fa.js",
        },
        title: "settings_2fa",
        description: "",
    },

    "/settings_password_change": {
        url: "/settings_password_change",
        endpoints: {
            0: "get-file/settings_password_change/settings_password_change.html",
            1: "static/Display/css/settings.css",
            2: "static/Display/js/settings_password_change.js",
        },
        title: "settings_password_change",
        description: "",
    },

    /* Game Page */
    "/play-pong" : {
        url: "/play-pong",
        endpoints: {
            0: "game/1",
            1: "game/2"
        },
        title: "Pong Game",
        description: "",
    },

    /* Chat Page */
    "/chat" : {
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
    let response = await fetch(window.location.origin + '/api/check/login/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    })
    if (!response.ok) {
        console.error("Error: no login status");
        return (false);
    }

    const user = await response.json();

    console.log("User: " + user.isLoggedIn);
    return (user.isLoggedIn);
}

const urlRoute = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    urlLocationHandler();
};

const loadPage = async (endpoints, url) => {
    const LoginState = await getLoginStat();
    isRunning = false;
    console.log("Dev JS: LoadPage", url.substring(0, 7), endpoints);
    if (!LoginState && url == '/register')
    {
        loadRegister(endpoints);
        return (0);
    }
    else if (LoginState && url == '/register')
    {
        window.history.replaceState({}, "", '/login');
        urlLocationHandler();
        return (0);
    }
    else if (!LoginState && url.substring(0, 6) == "/login")
    {
        loadLogin(endpoints);
        return (0);
    }
    else if (!LoginState && url.substring(0, 6) == "/login")
    {

    }
    else if (!LoginState && url != '/login')
    {
        window.history.replaceState({}, "", '/login');
        urlLocationHandler();
        return (0);
    }
    else if (LoginState && url == "/login")
    {
        window.history.replaceState({}, "", '/');
        urlLocationHandler();
        return (0);
    }
    else if (url == '/logout')
    {
        console.log("LOGOUT");
        data = await fetch(window.location.origin + '/logout');
        deleteCookie("access_token");
        deleteCookie("refresh_token");
        console.log(data);
        window.history.replaceState({}, "", '/');
        urlLocationHandler();
        return (0);
    }
    else if (url == "/settings" || url == "/settings_password_change" || url == "/settings_2fa")
    {
        console.log("Dev: Settings if statement");
		loadSettings(endpoints);
        return (0);
    }
	else if (url == "/profile")
	{
		loadProfile(endpoints);
		return (0);
	}
    else if (url == "/login")
    {
        loadLogin(endpoints);
        return (0);
    }
    else if (url == "/chat")
    {
        loadChat(endpoints);
        return (0);
    }
    else if (url == "/vsPage")
    {
        loadVsPage(endpoints);
        return (0);
    }
    else if (url == "/about")
    {
        loadAbout(endpoints);
        return (0);
    }
    else if (url == "/tournament")
    {
        loadTournament(endpoints);
        return (0);
    }
    else if (url == "/pong")
    {
        loadPong(endpoints);
        return (0);
    }


    const html = await fetch(window.location.origin + '/' + endpoints[0])
    .then(response => response.text());


    const app = document.getElementById("app");

    app.innerHTML = "";
    app.innerHTML = html;
};

const urlLocationHandler = async () => {
    const location = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    console.log("dev JSS:ULH Location = " + location.substring(0, 9));
    if (location.substring(0, 7) == "/login/")
    {
       console.log("Dev js: location", location);
       //alert(urlParams.get('code'));
       document.cookie = `code42=${urlParams.get('code')}`;
    }
    if (location.length == 0)
    {
        location = "/";
    }
	console.log("ULH Location = " + location);
    const route = urlRoutes[location] || urlRoutes[404];
    document.title = route.title;
    loadPage(route.endpoints, route.url);
};

async function loadProfile(endpoints)
{
	const profileHtml = await fetch(window.location.origin + '/' + endpoints[0])
    .then(response => response.text());
	const profileCss = await fetch(window.location.origin + '/' + endpoints[1])
    .then(response => response.text());
	const profileJs = await fetch(window.location.origin + '/' + endpoints[2])
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

async function loadVsPage(endpoints)
{
	const profileHtml = await fetch(window.location.origin + '/' + endpoints[0])
    .then(response => response.text());
	const profileCss = await fetch(window.location.origin + '/' + endpoints[1])
    .then(response => response.text());
	const profileJs = await fetch(window.location.origin + '/' + endpoints[2])
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


async function loadTournament(endpoints)
{
	const tournamentHtml = await fetch(window.location.origin + '/' + endpoints[0])
    .then(response => response.text());
	const tournamentCss = await fetch(window.location.origin + '/' + endpoints[1])
    .then(response => response.text());
	const tournamentJs = await fetch(window.location.origin + '/' + endpoints[2])
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


async function loadSettings(endpoints)
{
	const settingsHtml = await fetch(window.location.origin + '/' + endpoints[0])
    .then(response => response.text());
	const settingsCss = await fetch(window.location.origin + '/' + endpoints[1])
    .then(response => response.text());
	const settingsJs = await fetch(window.location.origin + '/' + endpoints[2])
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


async function loadAbout(endpoints)
{
	const aboutHtml = await fetch(window.location.origin + '/' + endpoints[0])
    .then(response => response.text());
	const aboutCss = await fetch(window.location.origin + '/' + endpoints[1])
    .then(response => response.text());
	const aboutJs = await fetch(window.location.origin + '/' + endpoints[2])
    .then(response => response.text());

	const app = document.getElementById('app');
	app.innerHTML = aboutHtml;
	
	const style = document.createElement('style');
	style.appendChild(document.createTextNode(aboutCss));

	const script = document.createElement('script');
	script.innerHTML = aboutJs;

	app.appendChild(script);
	app.appendChild(style);
	delete script;
	delete style;
}

async function loadPong(endpoints)
{
	const gameInterfaceHtml = await fetch(window.location.origin + '/' + endpoints[0])
    .then(response => response.text());
	const gameInterfaceCss = await fetch(window.location.origin + '/' + endpoints[1])
    .then(response => response.text());
	const gameInterfaceJs = await fetch(window.location.origin + '/' + endpoints[2])
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

async function loadLogin(endpoints)
{
    console.log("loadLoing");
    const loginHtml = await fetch(window.location.origin + '/' + endpoints[0], {
        method: 'GET',
        headers: {
            'Content-type': 'text/html'
        }
    })
    .then(response => response.text());
    // const loginCss = await fetch(window.location.origin + '/' + endpoints[1])
    // .then(response => response.text());
    const loginJs = await fetch(window.location.origin + '/' + endpoints[2], {
        method: 'GET',
        headers: {
            'Content-type': 'text/javascript'
        }
    })
    .then(response => response.text());

    var loginCss = await fetch(window.location.origin + '/' + endpoints[1], {
        method: 'GET',
        headers: {
            'Content-type': 'text/css'
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

async function loadRegister(endpoints)
{
    console.log("loadLoing");
    const loginHtml = await fetch(window.location.origin + '/' + endpoints[0], {
        method: 'GET',
        headers: {
            'Content-type': 'text/html'
        }
    })
    .then(response => response.text());
    // const loginCss = await fetch(window.location.origin + '/' + endpoints[1])
    // .then(response => response.text());
    const loginJs = await fetch(window.location.origin + '/' + endpoints[2], {
        method: 'GET',
        headers: {
            'Content-type': 'text/javascript'
        }
    })
    .then(response => response.text());

    var loginCss = await fetch(window.location.origin + '/' + endpoints[1], {
        method: 'GET',
        headers: {
            'Content-type': 'text/css'
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

async function loadGame(endpoints)
{
    const gameHtml = await fetch(endpoints[0])
    .then(response => response.text());
    const gameJs = await fetch(endpoints[1])
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

async function loadChat(endpoints)
{
	const chatHtml = await fetch(window.location.origin + '/' + endpoints[0])
    .then(response => response.text());
	const chatCss = await fetch(window.location.origin + '/' + endpoints[1])
    .then(response => response.text());
	const chatJs = await fetch(window.location.origin + '/' + endpoints[2])
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

window.onpopstate = urlLocationHandler;
window.route = urlRoute;

urlLocationHandler();