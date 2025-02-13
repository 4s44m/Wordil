const targetWord = "WINFO"; // Word to guess
let currentGuess = ""; // The current guess string
let attempts = 0; // Number of attempts


//MOUSE TRACKER
let mouseX = 0;
let mouseY = 0;



// DOM Elements
const grid = document.getElementById("grid");
const keyboard = document.getElementById("keyboard");

// Create the game grid
for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
        const div = document.createElement("div");
        div.id = `cell-${i}-${j}`;
        div.classList.add("grid-cell");
        grid.appendChild(div);
    }
}

// Update the grid with the current guess
function updateGrid() {
    for (let i = 0; i < 5; i++) {
        const cell = document.getElementById(`cell-${attempts}-${i}`);
        cell.textContent = currentGuess[i] || "";
    }
}


// Listen for physical keyboard input
document.addEventListener('keydown', function(event) {
    const pressedKey = event.key.toUpperCase();
    handleKeyPress(pressedKey);
});

// Listen for mouse clicks on the on-screen keyboard
const keys = document.querySelectorAll('.key'); //creates a variable
if (keys.length) {
    keys.forEach(key => {
        key.addEventListener('click', function() {
            const clickedKey = key.getAttribute('data-key');
            handleKeyPress(clickedKey);
        });
    });
}

// Handle key press
let incorrectLetters = new Set(); // Store incorrect letters

function handleKeyPress(key) {
    if (incorrectLetters.has(key)) return; // Ignore already incorrect letters
 
    if (key === "ENTER") {
        checkGuess();
    } else if (key === "BACKSPACE") {
        currentGuess = currentGuess.slice(0, -1);
    } else if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
        currentGuess += key;
    }
    
    updateGrid();
}

function checkGuess() {
    if (currentGuess.length !== 5) return; //makes sure all boxes are filled out before checking!

    const guess = currentGuess.toUpperCase();
    for (let i = 0; i < 5; i++) {
        const cell = document.getElementById(`cell-${attempts}-${i}`);
        if (guess[i] === targetWord[i]) {
            cell.style.backgroundColor = "pink"; // Correct letter in correct position
            cell.style.textShadow = "5px 5px 5px rgb(236, 208, 216)" ;
            cell.style.color ="rgb(70, 23, 27)"; 
        } else if (targetWord.includes(guess[i])) {
            cell.style.backgroundColor ="rgb(148, 150, 192) "; // Correct letter in wrong position
        } else {
            cell.style.backgroundColor = "gray"; // Incorrect letter
            incorrectLetters.add(guess[i]); // Store incorrect letter
            disableKey(guess[i]); // Disable letter
        }
    }

    attempts++;
    currentGuess = "";

    if (guess === targetWord) {            //[✓ RIGHT ANSWER]

        addFloatingQuestionMark(attempts-1);
        setTimeout(() => {
            showCustomAlert("Winfo?");
            triggerConfetti(); // 🎉 Confetti effect when you win
        }, 1000);
        


    } else if (attempts >= 6) { //creates a new row to continue the game     [X WRONG ANSWER]
        let i= attempts
            for (let j = 0; j < 5; j++) {
                const div = document.createElement("div");
                div.id = `cell-${i}-${j}`;
                div.classList.add("grid-cell");
                grid.appendChild(div);
            }
        }
    }

//find mouse on screen
document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});
// Function to show a custom alert
function showCustomAlert(message) { 
    
    const alertBox = document.createElement("div");
    alertBox.textContent = message;
    alertBox.classList.add("custom-alert");
    document.body.appendChild(alertBox);

    // Position near mouse coordinates
    alertBox.style.position = "absolute";
    alertBox.style.top = `${mouseY - 105}px`; // Slight offset

    alertBox.style.left = `${mouseX - 105}px`;
    
    
    const accButton = document.createElement("button");
    accButton.textContent = "yes";
    accButton.classList.add("custom-alert-button");

    alertBox.appendChild(accButton);

    accButton.addEventListener("click", function() {
        document.body.removeChild(alertBox); // Removes the alert box (and button) from the document

    });
       
}

// Function to add a cell with "?"
function addFloatingQuestionMark(row) {
    const rowElement = document.getElementById(`cell-${row}-4`);
    if (!rowElement) return;
    
    const questionMark = document.createElement("div");
    questionMark.textContent = "?";
    questionMark.classList.add("floating-question");
    document.body.appendChild(questionMark);

    const rect = rowElement.getBoundingClientRect();
    questionMark.style.position = "absolute";
    questionMark.style.top = `${rect.top}px`;
    questionMark.style.left = `${rect.left + rowElement.offsetWidth + 10}px`; // 10px gap from last cell
}


// Function to disable keys
function disableKey(letter) {
    const button = document.querySelector(`.key[data-key="${letter}"]`);
    if (button) {
        button.disabled = true;
        button.style.opacity = "0.5"; // Visually indicate it's disabled
        button.style.pointerEvents = "none";
    }
}

function triggerConfetti() {
    let duration = 2 * 1000; // 2 seconds
    let end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

