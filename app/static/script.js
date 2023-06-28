
// Script for index.html. 
// Defines global variables and functions. 

// grey hints are letters that are not in the target word
// yellow hints are letters that are in the target word but in a differet position
// green hints are letters that are in the target word in the correct position
let greyHints = [];
let yellowHints = [];
let greenHints = [];

// the id of the current grid box
let currentBox = 0;

// an array of every possible word in a game of wordle
let allWords;

// get the words from a text file in the same folder (static folder)
fetch('words.txt')
    .then(response => response.text())
    .then(data => {
        allWords = data.split('\n');
    })
    .catch(error => {
        console.error('Error reading file:', error);
        allWords = [];
    });

// Adds given key from the keyboard to the current grid box
// Hides the keyboard and shows the colour selection buttons
//
function selectKey(key) {
    var boxID = currentBox.toString();
    var box = document.getElementById(boxID);
    box.innerText = key.toUpperCase();
    box.style.color = "buttontext";
    box.style.backgroundColor = "buttonface";
    document.getElementById("keyboard").style.display = "none";
    document.getElementById("submit").style.display = "none";
    var feedback = document.getElementById("feedback");
    feedback.style.display = "flex";
    feedback.style.justifyContent = "center";
}

// Fills the current grid box with the chosen colour. 
// Adds the grid box key to one of the hints arrays depending on the colour. 
// Hides the colour selection buttons and shows the keyboard again.
//
function selectColour(colour) {
    var boxID = currentBox.toString();
    var box = document.getElementById(boxID);
    var letter = box.innerText.toLowerCase();
    if (colour == 'grey') {
        box.style.backgroundColor = "dimgrey";
        box.style.color = "white";
        greyHints.push(letter);
    }
    if (colour == 'yellow') {
        box.style.backgroundColor = "goldenrod";
        box.style.color = "black";
        yellowHints[yellowHints.length] = letter;
        yellowHints[yellowHints.length] = (parseInt(currentBox) % 5) + 1;
    }
    if (colour == 'green') {
        box.style.backgroundColor = "seagreen";
        box.style.color = "white";
        greenHints[greenHints.length] = letter;
        greenHints[greenHints.length] = (parseInt(currentBox) % 5) + 1;
    }
    document.getElementById("feedback").style.display = "none";
    var keyboard = document.getElementById("keyboard");
    keyboard.style.display = "flex";
    keyboard.style.justifyContent = "center";
    keyboard.style.flexDirection = "column";
    keyboard.style.alignItems = "center";
    document.getElementById("submit").style.display = "inline";
    currentBox += 1;
}

// Re-initializes global variables back to their original state. 
// Hides and shows elements to bring the page back to the initiial state. 
//
function restart() {
    currentBox = 0;
    greyHints.length = 0;
    yellowHints.length = 0;
    greenHints.length = 0;
    document.getElementById("hints").style.display = "block";
    document.getElementById("feedback").style.display = "none";
    var elements = document.querySelectorAll(".result-word");
    elements.forEach(function(element) {
        element.remove();
    });
    document.getElementById("results").style.display = "none";
    var keyboard = document.getElementById("keyboard");
    keyboard.style.display = "flex";
    keyboard.style.justifyContent = "center";
    keyboard.style.flexDirection = "column";
    keyboard.style.alignItems = "center";
    document.getElementById("submit").style.display = "inline";
    document.getElementById("add-more").style.display = "none";
    for(let i = 0; i < 25; i++) {
        var boxID = i.toString();
        var box = document.getElementById(boxID);
        box.innerText = '0';
        box.style.backgroundColor = '#161515';
        box.style.color = '#161515'
    }
}

// Hides the results and shows the grid and keyboard again.
// 
function addMore() {
    document.getElementById("hints").style.display = "block";
    document.getElementById("feedback").style.display = "none";
    var elements = document.querySelectorAll(".result-word");
    elements.forEach(function(element) {
        element.remove();
    });
    document.getElementById("results").style.display = "none";
    var keyboard = document.getElementById("keyboard");
    keyboard.style.display = "flex";
    keyboard.style.justifyContent = "center";
    keyboard.style.flexDirection = "column";
    keyboard.style.alignItems = "center";
    document.getElementById("submit").style.display = "inline";
    document.getElementById("add-more").style.display = "none";
}

// Filters out words from allWords that don't pass the hints. 
// Hides the grid and keyboard
// Displays the remaining words on the page (as well as number of remaining words).
//
function submit() {
    document.getElementById("results").style.display = "block";
    document.getElementById("results-div").scrollTop = 0;
    document.getElementById("hints").style.display = "none";
    document.getElementById("submit").style.display = "none";
    document.getElementById("add-more").style.display = "inline";
    var numWords = 0;
    var elementAbove = document.getElementById("dummy-element");
    allWords.forEach(function(word) {
        if (check_grey(word, greyHints) && check_yellow(word, yellowHints) && check_green(word, greenHints)) {
            numWords += 1;
            var paragraph = document.createElement("p");
            paragraph.innerText = word;
            paragraph.className = "result-word";
            elementAbove.insertAdjacentElement("afterend", paragraph);
            elementAbove = paragraph;
        }
    });
    var header = document.getElementById("results-header");
    if (numWords == 1) {
        header.innerText = numWords.toString() + " possible word";
    } else {
        header.innerText = numWords.toString() + " possible words";
    }
}

// Takes a word and an array of letters.
// Returns true if none of the letters in the word are in the array.
//
function check_grey(word, hints) {
    if (hints.length == 0) {
        return true;
    }
    var chars = word.split("");
    for(var i = 0; i < chars.length; i++) {
        if (hints.includes(chars[i])) {
            return false;
        }
    }
    return true;
}

// Takes a word and an array of letters followed by positions.
// Returns true if none of the letters from hints are in the specified position in the word.
//
function check_yellow(word, hints) {
    if (hints.length == 0) {
        return true;
    }
    var chars = word.split("");
    count = 0;
    for(var i = 0; i < hints.length; i++) {
        if (i % 2 == 0) {
            if (chars.includes(hints[i]) == false) {
                return false;
            } else {
                if (hints[i] != chars[parseInt(hints[i + 1]) - 1]) {
                    count += 1;
                }
            }
        }
    }
    return count == (hints.length / 2);
}

// Takes a word and array of letters.
// Returns true if all of the letters from hints are in the specified positions in word. 
//
function check_green(word, hints) {
    if (hints.length == 0) {
        return true;
    }
    var chars = word.split("");
    count = 0;
    for(var i = 0; i < hints.length; i++) {
        if (i % 2 == 0) {
            if (chars.includes(hints[i]) == false) {
                return false;
            } else {
                if (hints[i] == chars[parseInt(hints[i + 1]) - 1]) {
                    count += 1;
                }
            }
        }
    }
    return count == (hints.length / 2);
}