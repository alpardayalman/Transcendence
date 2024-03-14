const urlRoutes = {
    /* 404 Page */
    404: {
        url: "/404",
        endpoints: {
            0: "game/5",
        },
        key: "",
        title: "404",
        description: "",
    },


	/* Home Page */
    "/": {
        url: "/",
        endpoints: {
            0: "get-file/home/home.css",
        },
        key: "",
        title: "Home",
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
        key: "",
        title: "Profile",
        description: "",
    },


    "/ft_login": {
        url: "/ft_login",
        endpoints: {
            0: "get-file/ft_login/ft_login.html",
            1: "static/Display/css/ft_login.css",
            2: "static/Display/js/ft_login.js",
        },
        key: "",
        title: "42 Login",
        description: "",
    },


    "/logout" : {
        url: "/logout",
        endpoints: {
            0: "/logout",
        },
        key: "",
        title: "",
        description: "",
    },    

    "/login": {
        url: "/login",
        endpoints: {
            0: "get-file/login/login.html",
            1: "static/Display/css/login.css",
            2: "static/Display/js/login.js",
        },
        key: "",
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
        key: "",
        title: "Register",
        description: "",
    },


    /* About Page */
    "/about": {
        url: "/about",
        endpoints: {
            0: "get-file/about/about.html",
			1: "static/Display/css/about.css",
			2: "static/Display/js/about.js",
        },
        key: "",
        title: "about",
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
        key: "",
		title: "Settings",
		description: "",
	},


    /* Settings 2FA */
    "/settings_2fa": {
        url: "/settings_2fa",
        endpoints: {
            0: "get-file/settings_2fa/settings_2fa.html",
            1: "static/Display/css/settings.css",
            2: "static/Display/js/settings_2fa.js",
        },
        key: "",
        title: "settings_2fa",
        description: "",
    },

    
    /* Settings Password Change */
    "/settings_password_change": {
        url: "/settings_password_change",
        endpoints: {
            0: "get-file/settings_password_change/settings_password_change.html",
            1: "static/Display/css/settings.css",
            2: "static/Display/js/settings_password_change.js",
        },
        key: "",
        title: "settings_password_change",
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
        key: "",
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
        key: "",
		title: "Pong",
		description: "",
	},

};

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
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
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

const urlRoute = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    urlLocationHandler();
};

const urlLocationHandler = async () => {
    // const urlParams = new URLSearchParams(window.location.search);
    const path = window.location.pathname;
    if (path.length == 0)
        path = "/";

    const location = path.substring(0, path.indexOf('/', 1));
    const key = path.substring(location.length, path.length);

    const route = (location.length == 0) ? (urlRoutes[key] || urlRoutes[404]) : (urlRoutes[location] || urlRoutes[404]);
    if (location.length != 0) {
        route.url = location;
        route.key = key;
    } else {
        route.url = key;
        route.key = "";
    }

    console.log("route.url = \'" + route.url + "\'");
    console.log("route.key = \'" + route.key + "\'");

    document.title = route.title;
    loadPage(route);
};

const loadPage = async (route) => {
    const loginStatus = await getLoginStatus();

    if (route.url == '/ft_login'){
        const urlParams = new URLSearchParams(route.key);
        document.cookie = `code42=${urlParams.get('code')}`; 
        loadft_login(route.endpoints, route.key)
        return (0);
    } else if (!loginStatus && route.url != '/login') {
        replaceUrl('/login');
        return (0);
    }

    console.log(route);
    switch (route.url)
    {
        case "/register":
            if (loginStatus) {
                replaceUrl('/');
            } else {
                loadRegister(route.endpoints);
            }
        break ;
    
        case "/login":
            if (loginStatus) {
                replaceUrl('/');
            } else {
                loadLogin(route.endpoints);
            }
        break ;

        case "/ft_login":
            console.log("FTFTFTFTFTFTFT");
            loadft_login(route.endpoints, route.key);
        break ;

        case "/logout":
            console.log("Logout");
            data = await fetch(window.location.origin + '/logout');
            deleteCookie("access_token");
            deleteCookie("refresh_token");
            console.log(data);
            replaceUrl('/');
        break; 
    
        case "/settings": 
        case "/settings_password_change":
        case "/settings_2fa": 
        case "/profile":
        case "/about":
        case "/chat":
            console.log("COMMON");
            loadDefaultPage(route);
        break ;

        case "/profile":
            loadDefaultPage(route);
        break ;

        case "/pong":
            isRunning = true;
            loadDefaultPage(route);
        break ;

        default: 
            console.log("DEFAULT");
            const html = await fetch(window.location.origin + '/' + route.endpoints[0])
            .then(response => response.text());

            const app = document.getElementById("app");
            app.innerHTML = "";
            app.innerHTML = html;
        break ;
    }
};

window.onpopstate = urlLocationHandler;
window.route = urlRoute;

let isRunning = false;

async function loadDefaultPage(route)
{
    const html = await fetch(window.location.origin + '/' + route.endpoints[0])
    .then(response => response.text());
    console.log(html);
	const css = await fetch(window.location.origin + '/' + route.endpoints[1])
    .then(response => response.text());
    console.log(css);
	const js = await fetch(window.location.origin + '/' + route.endpoints[2])
    .then(response => response.text());
    console.log(js);

    const app = document.getElementById('app');
	app.innerHTML = html;

	const style = document.createElement('style');
	style.appendChild(document.createTextNode(css));

	const script = document.createElement('script');
	script.innerHTML = js;

	app.appendChild(script);
	app.appendChild(style);
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

async function loadft_login(endpoints, url)
{
    console.log("loadLoing");

    // const loginCss = await fetch(window.location.origin + '/' + endpoints[1])
    // .then(response => response.text());
    let loginJs = await fetch(window.location.origin + '/' + endpoints[2], {
        method: 'GET',
        headers: {
            'Content-type': 'text/javascript'
        }
    })
    .then(response => response.text());
    loginJs = loginJs.replaceAll("{URL}", url);
    console.log("Dev: loginJs", loginJs);

    const navi = document.getElementById('navigation');
    navi.setAttribute("hidden", "hidden");

    const app = document.getElementById('app');
    app.innerHTML = "<button id='redirectLogin'>Redirect To our Website</button>";

    const script = document.createElement('script');
    script.innerHTML = loginJs;

    app.appendChild(script);
    delete script;

}


const redirectUrl = (url) => {
    window.history.pushState({}, "", url);
    urlLocationHandler();
}

const replaceUrl = (url) => {
    window.history.replaceState({}, "", url);
    urlLocationHandler();
}

/* SEE IF THE CURRENT USER IS LOGGED IN */
const getLoginStatus = async () => {
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

    console.log("User login status: " + user.isLoggedIn);
    return (user.isLoggedIn);
}



urlLocationHandler();