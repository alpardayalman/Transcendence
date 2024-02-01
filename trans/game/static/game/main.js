document.getElementById("btn1").addEventListener("click", loadGame);
document.getElementById("btn2").addEventListener("click", unloadGame);
document.getElementById("btn3").addEventListener("click", showInner);
document.getElementById("btn4").addEventListener("click", showInnerBody);
document.getElementById("btn5").addEventListener("click", test);

const gameFile = '';

function test() {
    console.log("Test");

    var xhr = new XMLHttpRequest();

    xhr.open('GET', 'test.html', true);
    xhr.onload = function() {
        if (this.status == 200) {
            document.getElementById("game").innerHTML = this.responseText;
        }
    }
    xhr.send();
}

function loadGame() {
    console.log("Loading game...");

    var xhr = new XMLHttpRequest();

    xhr.open("GET", "game.js", true);

    xhr.onload = function() {
        if (this.status == 200) {
            // Create a script element
            const scriptElement = document.createElement("script");

            // Set a specific attribute to identify the script later
            scriptElement.setAttribute("data-game-script", "true");

            // Set the script content to the loaded game script
            scriptElement.textContent = this.responseText;

            // Append the script element to the head of the document
            document.getElementById("game").appendChild(scriptElement);

            console.log("Game loaded successfully!");
        }
    };

    xhr.onerror = function() {
        console.error("Failed to load the game.");
    };

    xhr.send();
}


// function loadGame() {
//     console.log("Loading game...");

//     var xhr = new XMLHttpRequest();

//     xhr.open("GET", "game.js", true);

//     xhr.onload = function() {
//         if (this.status == 200) {
//             let output = `<script>${this.responseText}</script>`;
//             const isRunning = true;
//             eval(this.responseText);
//             //output = output.replace("const isRunning = false;", `const isRunning = ${isRunning};`);
//             // document.getElementById("game").innerHTML = output;
//         }
//     }

//     xhr.send();
// }

// function loadGame() {
//     console.log("Loading game...");

//     var xhr = new XMLHttpRequest();

//     xhr.open("GET", "game.html", true);

//     xhr.onload = function() {
//         if (this.status == 200) {
//             document.getElementById("game").innerHTML = this.responseText;
//         }
//     }
//     xhr.send();
// }

// function unloadGame() {
//     console.log("Unloading game...");
//     document.getElementById("game").innerHTML = "";
// }

function unloadGame() {
    console.log("Unloading game...");

    // Call the unloadGame function in the loaded script (if available)
    if (typeof gameUnload === 'function') {
        gameUnload();
    }

    // Find the script element with the 'data-game-script' attribute
    var gameScriptElement = document.querySelector('script[data-game-script="true"]');

    if (gameScriptElement) {
        // Remove the script element
        gameScriptElement.parentNode.removeChild(gameScriptElement);
        delete gameScriptElement;
        document.getElementById("game").innerHTML = ""; 
        console.log("Game unloaded successfully!");
    } else {
        console.warn("No game script found to unload.");
    }
}

function showInnerBody() {
    console.log("Showing inner HTML...");
    console.log(document.body.innerHTML);
}

function showInner() {
    console.log("Showing inner HTML...");
    console.log(document.getElementById("game").innerHTML);
}