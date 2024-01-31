// navigation.js
// import {main} from "./main.js";

function loadPage(url, updateHistory = true) {
    fetch(url)
        .then(response => response.text())
        //.then(response => console.log(response))
        .then(html => {
            //colsole.log()
            document.getElementById('app').innerHTML = html//.getElementById('app');
            console.log(document.getElementById('app').innerHTML);
            //console.log('peynir');
            //console.log(html);
            if (url === '/form-submission/') {
                initializeFormSubmission();
            }
             if (url === '/game/') {
                //window.onload = function() {
                    // new main.Main();
                    // document.
                    const sc = document.createElement('script');
                    sc.src = '/static/js/game.js';
                    sc.type = 'module';
                    //console.log(document.getElementById('app'))
                    document.getElementById('app').append(sc);
                    //console.log(sc)
                //};
             }
            if (updateHistory) {
                history.pushState({}, '', url);
            }
        })
        .catch(error => console.error('Error loading page:', error));
}

function handleNavigation() {
    const path = window.location.pathname;

    if (path === '/spa-page/') {
        loadPage('/spa-page/', false);
    }
    else if (path == "/form-submission/") {
        loadPage('/form-submission/', false);
    }
    else if (path === "/game/") {
        loadPage('/game/', false);
    }
    else {
        loadPage('/', false);
    }
}

function initializeFormSubmission() {
    const form = document.getElementById('yourFormId');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Form submission successful:', data);
                // Update content or provide feedback to the user
            } else {
                console.error('Form submission failed:', data);
            }
        })
        .catch(error => {
            console.error('Error submitting form:', error);
        });
    });
}

// Function to get the CSRF token from cookies
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Add event listeners for popstate and DOMContentLoaded
window.addEventListener('popstate', handleNavigation);
document.addEventListener('DOMContentLoaded', handleNavigation);
