document.addEventListener('click', (e) => {
    const {target} = e;

    if (!target.matches("nav a"))
    {
        console.log("Dev: Didn't match 'nav a' ");
        return ;
    }
    e.preventDefault();
    urlRoute();
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
};

const urlRoute = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    urlLocationHandler();
};

const loadPage = async (endpoints, url) => {
    if (url == "/settings")
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

async function loadLogin(endpoints)
{
    const loginHtml = await fetch(window.location.origin + '/' + endpoints[0])
    .then(response => response.text());
    const loginCss = await fetch(window.location.origin + '/' + endpoints[1])
    .then(response => response.text());
    const loginJs = await fetch(window.location.origin + '/' + endpoints[2])
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

window.onpopstate = urlLocationHandler;
window.route = urlRoute;

urlLocationHandler();