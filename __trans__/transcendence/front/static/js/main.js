// navigation.js
// function loadPage1(url, updateHistory = true) {
//     fetch(url)
//         .then(response => response.text())
//         .then(html => {
//             document.getElementById('app').innerHTML = html;
//             if (url === '/form-submission/') {
//                 initializeFormSubmission();
//             }
//             if (updateHistory) {
//                 history.pushState({}, '', url);
//             }
//         })
//         .catch(error => console.error('Error loading page:', error));
// }

function loadPage($page) {
    if ($page == "") return;
    console.log('loadPage=', $page);
    const container = document.getElementById("app");
    window.location.replace($page);
    const request = new XMLHttpRequest();
    if ($page == "/") {
        request.open("GET", 'api/home');
    } else {
        request.open("GET", "api/"+$page);
    }
    document.title = $page;
    
    request.send();
    request.onload = function() {
        if (request.status == 200) {
            container.innerHTML = request.responseText;
        }
    }
    
    // history.pushState({}, '', url);
}

window.onload = function() {
    const path = window.location.pathname.split("/");
    console.log('my path=', path[1]);
    switch (path[1]) {
        case "home":
        {
            loadPage("home");
            break;
        }
        case "login":
        {
            loadPage("login");
            break;
        }
        default:
        {
            loadPage("/");
            break;
        }
    }

    document.querySelectorAll(".menu_item").forEach((item) => {
        console.log('item=', item);
        item.addEventListener("click", function(){
            const path = item.getAttribute("value");
            loadPage(path);
            if (path == "") {
                window.history.pushState("", "", "/");
                return;
            }
            window.history.pushState("", "", path);
        });
    });
}
// function handleNavigation() {
//     const path = window.location.pathname;

//     if (path === '/spa-page/') {
//         loadPage('/spa-page/', false);
//     }
//     else if (path == "/form-submission/") {
//         loadPage('/form-submission/', false);
//     }
// }

// function initializeFormSubmission() {
//     const form = document.getElementById('yourFormId');

//     form.addEventListener('submit', function (event) {
//         event.preventDefault();

//         const formData = new FormData(form);

//         fetch(form.action, {
//             method: 'POST',
//             body: formData,
//             headers: {
//                 'X-CSRFToken': getCookie('csrftoken'),
//             },
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 console.log('Form submission successful:', data);
//                 // Update content or provide feedback to the user
//             } else {
//                 console.error('Form submission failed:', data);
//             }
//         })
//         .catch(error => {
//             console.error('Error submitting form:', error);
//         });
//     });
// }

// // Function to get the CSRF token from cookies
// function getCookie(name) {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(';').shift();
// }

// // Add event listeners for popstate and DOMContentLoaded
// window.addEventListener('popstate', handleNavigation);
// document.addEventListener('DOMContentLoaded', handleNavigation);