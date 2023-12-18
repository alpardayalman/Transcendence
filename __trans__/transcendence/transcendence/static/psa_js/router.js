const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const routes = {
    "/404": "http://127.0.0.1:8000/404.html",
    "/": "/index.html",
    "/pong": "http://127.0.0.1:8000/pong",
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes['404']; // Burada hata durumunu belirtmek için '404' kullanabilirsiniz
    try {
        const response = await fetch(route); // Django API'nizden içeriği almak için gerekli endpoint'i kullanın
        if (!response.ok) {
            throw new Error('Response failed');
        }
        const html = await response.text();
        document.getElementById("main-page").innerHTML = html;
    } catch (error) {
        // Hata durumunu yönetmek için bir mekanizma
        console.error('Error fetching data:', error);
        // Örneğin, hata durumunda varsayılan bir sayfa gösterilebilir
        const errorPage = await fetch(routes['404']).then((data) => data.text());
        document.getElementById("main-page").innerHTML = errorPage;
    }
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
