// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getDatabase, ref, get, set, child, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBQJeeGGiBvlsSpoM896Ue_aYbBc-ax0gk",
    authDomain: "countryscramblergame.firebaseapp.com",
    projectId: "countryscramblergame",
    storageBucket: "countryscramblergame.firebasestorage.app",
    messagingSenderId: "392145826225",
    appId: "1:392145826225:web:4306cbab53fc177c27cd90",
    measurementId: "G-KNFVMC4JYF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

fetch('Dictionaries/countries.json')
    .then(res => res.json())
    .then(data => {
        saveDict(data);
    })
    .catch(err => console.error(err));

let dictionary;
const countries = 195;
let score = 0;
let word = "";
let guessed = true;
let highScore = 0;
let name = "default";

document.addEventListener("keydown", function(event) {
    if (event.key === 'Enter') {
        if (guessed) {
            start();
        }
        else {
            onSubmit();
        }
    }
})

document.getElementById("submitName").addEventListener("click", scoreName);
document.getElementById("startButton").addEventListener("click", start);
document.getElementById("submitButton").addEventListener("click", onSubmit);

function start() {
    if (guessed == true) {
        guessed = false;
        displayHighScores();

        document.getElementById("startButton").innerText = "Next";
        document.getElementById("guess").value = ""
        document.getElementById("correctAnswer").innerText = "";

        playGame();
    }
}


function playGame() {
    console.log(highScore);
    word = getRandomWord(0, countries);
    word = word.toLowerCase();
    console.log(word);
    let scrambled = scrambleWord(word);

    document.getElementById("scrambledString").innerText = scrambled;

}

function getRandomWord(start, end) {
    const rand = randomNumber(start, end);
    return dictionary[rand];
}

function randomNumber(start, end) {
    return Math.floor(Math.random() * (end - start)) + start;
}

function scrambleWord(word) {
    let scrambled = "";

    for (let i = 0; i < word.length; i++) {
        let rand = randomNumber(0, scrambled.length);
        scrambled = scrambled.slice(0, rand) + word[i] + scrambled.slice(rand)
    }

    return scrambled;
}

function onSubmit() {
    if (guessed == true) { return; }

    let guess = document.getElementById("guess").value;
    guess = guess.toLowerCase();
    if (guess === word) {
        score++
    } else {
        if (score > highScore) {
            set(ref(db, 'scores/' + name), { score: score });
            highScore = score;
            document.getElementById("highScore").innerText = "High Score: " + highScore;
        }
        score = 0;
    }

    guessed = true;

    document.getElementById("correctAnswer").innerText = word;
    document.getElementById("myScore").innerText = "Score: " + score;
}
function saveDict(data) {
    dictionary = data;
}

function scoreName() {
    const playerName = document.getElementById("playerNameInput").value;
    if (playerName) {
        document.getElementById("namePopup").style.display = "none";
        loadPlayerData(playerName);
        name = playerName;
    }
}

async function loadPlayerData(playerName) {
    const dbRef = ref(db);

    try {
        const snapshot = await get(child(dbRef, 'scores/' + playerName + '/score'));

        if (snapshot.exists()) {
            highScore = snapshot.val();
            document.getElementById("highScore").innerText = "High Score: " + highScore;
            console.log(highScore);
        } else {
            await set(ref(db, 'scores/' + playerName), { score: 0 });
        }
    } catch (error) {
        console.error(error);
    }
}
displayHighScores();

function displayHighScores() {
    const scores = getHighScores();
    const leaderboard = document.getElementById("scoreTable");
}

async function getHighScores() {
    const topScoresQuery = query(ref(db, 'scores'), orderByChild('score'), limitToLast(10));
    const snapshot = await get(topScoresQuery);
    let topScores
    if (snapshot.exists()) {
        topScores = Object.entries(snapshot.val())
        .sort((a, b) => b[1].score - a[1].score); 
    }
}
