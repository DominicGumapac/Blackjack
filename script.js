import {
    db,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit
} from "./firebase.js";

/* DOM */
const startBtn = document.getElementById("startBtn");
const hitBtn = document.getElementById("hitBtn");
const standBtn = document.getElementById("standBtn");

const playerCardsEl = document.getElementById("playerCards");
const dealerCardsEl = document.getElementById("dealerCards");

const playerSumEl = document.getElementById("playerSum");
const dealerSumEl = document.getElementById("dealerSum");

const resultEl = document.getElementById("result");
const scoreText = document.getElementById("scoreText");

const leaderboard = document.getElementById("leaderboard");

/* GAME STATE */
let playerCards = [];
let dealerCards = [];

let playerSum = 0;
let dealerSum = 0;

let gameOver = false;

let totalScore = 0;
let round = 1;

/* CARD */
function drawCard() {
    let c = Math.floor(Math.random() * 13) + 1;
    if (c > 10) return 10;
    if (c === 1) return 11;
    return c;
}

/* UI */
function updateUI() {
    playerCardsEl.textContent = playerCards.join(" ");
    dealerCardsEl.textContent = dealerCards.join(" ");

    playerSumEl.textContent = `Total: ${playerSum}`;
    dealerSumEl.textContent = `Total: ${dealerSum}`;

    scoreText.textContent = `Score: ${totalScore} | Round: ${round}`;
}

/* RESET ROUND */
function resetRound() {
    playerCards = [];
    dealerCards = [];
    playerSum = 0;
    dealerSum = 0;
    gameOver = false;
}

/* START GAME */
function startGame() {
    totalScore = 0;
    round = 1;
    resultEl.textContent = "";

    resetRound();
    dealCards();
}

/* DEAL */
function dealCards() {
    for (let i = 0; i < 2; i++) {
        let p = drawCard();
        let d = drawCard();

        playerCards.push(p);
        dealerCards.push(d);

        playerSum += p;
        dealerSum += d;
    }

    updateUI();
}

/* HIT */
function hit() {
    if (gameOver) return;

    let c = drawCard();
    playerCards.push(c);
    playerSum += c;

    updateUI();

    if (playerSum > 21) {
        resultEl.textContent = "You Bust! Game Over";
        gameOver = true;
        saveScore();
    }
}

/* STAND */
function stand() {
    if (gameOver) return;

    while (dealerSum < 17) {
        let c = drawCard();
        dealerCards.push(c);
        dealerSum += c;
    }

    updateUI();
    evaluate();
}

/* GAME LOGIC (FIXED LOOP SYSTEM) */
function evaluate() {
    gameOver = true;

    let gain = 0;

    // Dealer bust
    if (dealerSum > 21) {
        gain = playerSum;
        totalScore += gain;
        resultEl.textContent = `Dealer Bust! +${gain}`;

        setTimeout(nextRound, 1200);
        return;
    }

    // Player win
    if (playerSum > dealerSum) {
        gain = playerSum - dealerSum;
        totalScore += gain;
        resultEl.textContent = `You Win! +${gain}`;

        setTimeout(nextRound, 1200);
        return;
    }

    // Draw
    if (playerSum === dealerSum) {
        resultEl.textContent = "Draw!";
        setTimeout(nextRound, 1200);
        return;
    }

    // Dealer win
    resultEl.textContent = "Dealer Wins! Game Over";
    saveScore();
}

/* NEXT ROUND LOOP */
function nextRound() {
    round++;
    resetRound();
    dealCards();
}

/* SAVE SCORE */
async function saveScore() {
    const name = document.getElementById("playerName").value || "Anon";

    await addDoc(collection(db, "scores"), {
        name,
        score: totalScore,
        round,
        date: new Date().toLocaleString()
    });

    loadLeaderboard();
}

/* LEADERBOARD */
async function loadLeaderboard() {
    leaderboard.innerHTML = "";

    const q = query(
        collection(db, "scores"),
        orderBy("score", "desc"),
        limit(10)
    );

    const snap = await getDocs(q);

    snap.forEach(doc => {
        let d = doc.data();
        let li = document.createElement("li");
        li.textContent = `${d.name} - ${d.score} (Round ${d.round})`;
        leaderboard.appendChild(li);
    });
}

/* EVENTS */
startBtn.addEventListener("click", startGame);
hitBtn.addEventListener("click", hit);
standBtn.addEventListener("click", stand);

loadLeaderboard();