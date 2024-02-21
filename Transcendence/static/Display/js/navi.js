document.addEventListener('click', (e) => {
    const {target} = e;

    if (!target.matches("nav a") && !target.matches("#registerButtonInLoginPage") && !target.matches("#signInButtonInRegisterPage"))
    {
        console.log("Dev: Didn't match 'nav a' ");
        console.log("Dev: Or it's not a sap button");
        return ;
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

	/* Settings Page */
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
            0: "get-file/chat/rooms.html",
            1: "static/Chat/css/chat.css",
            2: "static/Chat/js/chat.js",
        },
        title: "Chat",
        description: "",
    },

    "/gameInterface": {
        url: "/gameInterface",
        endpoints: {
            0: "get-file/gameInterface/gameInterface.html",
            1: "static/Display/css/gameInterface.css",
            2: "static/Display/js/gameInterface.js",
        },
        title: "Game Interface",
        description: "",
    },
};

const getLoginStat = async () => {
    let response = await fetch(window.location.origin + '/check/login/', {
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
    else if (!LoginState && url != '/login')
    {
        window.history.replaceState({}, "", '/login');
        urlLocationHandler();
        return (0);
    }
    else if (!LoginState && url == "/login")
    {
        loadLogin(endpoints);
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
        await fetch(window.location.origin + '/logout');
        window.history.replaceState({}, "", '/');
        urlLocationHandler();
        return (0);
    }
    else if (url == "/settings")
    {
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
    else if (url == "/gameInterface")
    {
        loadGameInterface(endpoints);
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


async function loadGameInterface(endpoints)
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