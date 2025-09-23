fetch('Dictionaries/countries.json')
    .then(res => res.json())
    .then(data => {
        const dictionary = data;
        console.log(countries);
    })
    .catch(err => console.error(err));

let playing = true;
const countries = 195;
let score = 0;
let word = "";
let guessed = true;

function start() {
    if (guessed == true) {
        guessed = false;

        document.getElementById("startButton").innerText = "Next";
        document.getElementById("guess").value = ""
        document.getElementById("correctAnswer").innerText = "";

        playGame();
    }
}


function playGame() {

    word = getRandomWord(words, 0, countries);
    word = word.toLowerCase();
    console.log(word);
    let scrambled = scrambleWord(word);

    document.getElementById("scrambledString").innerText = scrambled;

}

function getRandomWord(words, start, end) {
    const rand = randomNumber(start, end);
    return words[rand];
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
    guess.toLowerCase();
    guess === word ? score++ : score = 0;

    guessed = true;

    document.getElementById("correctAnswer").innerText = word;
    document.getElementById("myScore").innerText = "Score: " + score;
}