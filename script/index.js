const ALL_ROUNDS = [
    {
        id: 1,
        image: 'image/COIL_Image_Frame_1.png',
        text: 'A viking riding in a golden carriage, being pulled by cows'
    },
    {
        id: 2,
        image: 'image/COIL_Image_Frame_2.png',
        text: 'The Little Mermaid eats frikadelle (meatball) and drinks Heineken.'
    },
    {
        id: 3,
        image: 'image/COIL_Image_Frame_3.png',
        text: 'Van Gogh builds a tulip out of LEGO'
    },
    {
        id: 4,
        image: 'image/COIL_Image_Frame_4.png',
        text: 'A wooden Kaj Bojesen monkey in a clog (klompen)'
    },
    {
        id: 5,
        image: 'image/COIL_Image_Frame_5.png',
        text: 'Two hoptimists jumping on syrup waffles (stroopwafel)'
    },
    {
        id: 6,
        image: 'image/COIL_Image_Frame_6.png',
        text: 'A hotdog is flying through the sky on the Flying Dutchmanman'
    },
    {
        id: 7,
        image: 'image/COIL_Image_Frame_7.png',
        text: 'A seal is surfing on a rugbrød (roggebrood)'
    },
    {
        id: 8,
        image: 'image/COIL_Image_Frame_8.png',
        text: 'A frikandel and a kroket are getting married at roskilde festival'
    },
    {
        id: 9,
        image: 'image/COIL_Image_Frame_9.png',
        text: 'A gouda cheese and babybell cheese are armwrestling'
    },
    {
        id: 10,
        image: 'image/COIL_Image_Frame_10.png',
        text: 'A herring drinking Cocio in Legoland'
    },
    {
        id: 11,
        image: 'image/COIL_Image_Frame_11.png',
        text: 'Miffy (Nijntje) playng kings game with Sinterklaas'
    },
    {
        id: 12,
        image: 'image/COIL_Image_Frame_12.png',
        text: 'The Skagen painters eating Hagelslag (sprinkles)'
    },
    {
        id: 13,
        image: 'image/COIL_Image_Frame_13.png',
        text: 'It is raining with hagelslag in Amsterdam'
    },
    {
        id: 14,
        image: 'image/COIL_Image_Frame_14.png',
        text: 'A viking is crashing into a windmill on a bike'
    },
    {
        id: 15,
        image: 'image/COIL_Image_Frame_15.png',
        text: 'The queen of denmark is drinking beer at efteling'
    },
    {
        id: 16,
        image: 'image/COIL_Image_Frame_16.png',
        text: 'A happy potato swimming in the waters of Copenhagen'
    },
    {
        id: 17,
        image: 'image/COIL_Image_Frame_17.png',
        text: 'A fisherman cycling underwater'
    },
    {
        id: 18,
        image: 'image/COIL_Image_Frame_18.png',
        text: 'A swan and a lion are camping together'
    },
    {
        id: 19,
        image: 'image/COIL_Image_Frame_19.png',
        text: 'The dutch king wearring an I love Denmark T-Shirt'
    },
    {
        id: 20,
        image: 'image/COIL_Image_Frame_20.png',
        text: 'Two bears smearing butter on a piece of bread'
    },
    {
        id: 21,
        image: 'image/COIL_Image_Frame_21.png',
        text: 'A bear in a boat going to America'
    },
    {
        id: 22,
        image: 'image/COIL_Image_Frame_22.png',
        text: 'The little sandman holding an umbrella'
    },
    {
        id: 23,
        image: 'image/COIL_Image_Frame_23.png',
        text: 'A bear is sleeping on a big mushroom'
    },
    {
        id: 24,
        image: 'image/COIL_Image_Frame_24.png',
        text: 'The baker on North Street is eating apple pie'
    }
];

const TOTAL_ROUNDS = 2; // per player
const MAX_TIME = 120;

let PLAYER1_ROUNDS = [];
let PLAYER2_ROUNDS = [];

let currentRound = 0;
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
let timerInterval = null;
let timeLeft = MAX_TIME;
let guessed = false;

// Pick 4 unique random images from the pool and split 2 per player
function pickRandomRounds() {
    const shuffled = [...ALL_ROUNDS].sort(() => Math.random() - 0.5);
    PLAYER1_ROUNDS = shuffled.slice(0, 2);
    PLAYER2_ROUNDS = shuffled.slice(2, 4);
}

function getPoints(secondsLeft) {
    const elapsed = MAX_TIME - secondsLeft;
    if (elapsed <= 60) return 50;
    if (elapsed <= 90) return 30;
    if (elapsed <= 120) return 10;
    return 0;
}

function addScore(pts) {
    if (currentPlayer === 1) player1Score += pts;
    else player2Score += pts;
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function startGame() {
    currentRound = 0;
    currentPlayer = 1;
    player1Score = 0;
    player2Score = 0;
    pickRandomRounds();
    showScreen('game-screen');
    loadRound();
}

function loadRound() {
    const rounds = currentPlayer === 1 ? PLAYER1_ROUNDS : PLAYER2_ROUNDS;
    const r = rounds[currentRound];
    guessed = false;
    timeLeft = MAX_TIME;

    const bg = document.getElementById('bg-image');
    bg.style.backgroundImage = `url('${r.image}')`;

    document.getElementById('caption-text').textContent = r.text;

    const score = currentPlayer === 1 ? player1Score : player2Score;
    document.getElementById('round-display').textContent =
        `P${currentPlayer} · Round ${currentRound + 1} of ${TOTAL_ROUNDS}`;

    document.getElementById('round-id-display').textContent = r.id;
    document.getElementById('score-display').querySelector('span').textContent = score;

    updateTimer(MAX_TIME);
    clearInterval(timerInterval);
    timerInterval = setInterval(tick, 1000);
}

function tick() {
    timeLeft--;
    updateTimer(timeLeft);

    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timeExpired();
    }
}

function updateTimer(t) {
    const el = document.getElementById('timer-number');
    el.textContent = t;

    // Colour cues: gold 60–90s, red 0–30s
    el.style.color = t <= 30 ? '#e05555' : t <= 60 ? 'var(--gold)' : 'var(--white)';
}

function flash() {
    const el = document.getElementById('flash');
    el.style.opacity = '0.35';
    setTimeout(() => el.style.opacity = '0', 150);
}

function timeExpired() {
    if (guessed) return;
    guessed = true;

    // 0 points — show score screen automatically
    const score = currentPlayer === 1 ? player1Score : player2Score;
    document.getElementById('pts-earned').textContent = 0;
    document.getElementById('score-total-val').textContent = score;
    document.getElementById('score-msg').textContent = 'OOPS! Time ran out, no points this round.';

    setNextButtonLabel();
    showScreen('score-screen');
}

function handleGuess() {
    if (guessed) return;
    guessed = true;
    clearInterval(timerInterval);

    const pts = getPoints(timeLeft);
    addScore(pts);
    flash();

    const score = currentPlayer === 1 ? player1Score : player2Score;
    document.getElementById('pts-earned').textContent = pts;
    document.getElementById('score-total-val').textContent = score;

    const elapsed = MAX_TIME - timeLeft;
    if (elapsed <= 60) document.getElementById('score-msg').textContent = 'Very impressive, answered within 60 seconds!';
    else if (elapsed <= 90) document.getElementById('score-msg').textContent = 'Good job!';
    else document.getElementById('score-msg').textContent = 'Just in time!';

    setNextButtonLabel();
    showScreen('score-screen');
}

function setNextButtonLabel() {
    const nextBtn = document.getElementById('next-btn');
    const isLastRound = currentRound === TOTAL_ROUNDS - 1;
    if (isLastRound && currentPlayer === 2) nextBtn.textContent = 'See Final Score →';
    else if (isLastRound && currentPlayer === 1) nextBtn.textContent = 'Switch Places →';
    else nextBtn.textContent = 'Next Image →';
}

function nextRound() {
    const isLastRound = currentRound === TOTAL_ROUNDS - 1;

    if (isLastRound && currentPlayer === 1) {
        document.getElementById('p1-score-display').textContent = player1Score;
        showScreen('switch-screen');
    } else if (isLastRound && currentPlayer === 2) {
        endGame();
    } else {
        currentRound++;
        showScreen('game-screen');
        loadRound();
    }
}

function startPlayer2() {
    currentPlayer = 2;
    currentRound = 0;
    showScreen('game-screen');
    loadRound();
}

function endGame() {
    const total = player1Score + player2Score;
    const max = TOTAL_ROUNDS * 50 * 2;
    document.getElementById('final-score').textContent = total;
    document.getElementById('end-out-of').textContent = `out of ${max} points`;
    document.getElementById('end-player-scores').textContent =
        `Player 1: ${player1Score} pts  ·  Player 2: ${player2Score} pts`;

    let verdict;
    if (total === max) verdict = 'A perfect score, good job!';
    else if (total >= max * 0.8) verdict = 'Impressive teamwork!';
    else if (total >= max * 0.5) verdict = 'You tried your best!';
    else verdict = 'Better luck next time!';
    document.getElementById('end-verdict').textContent = verdict;
    showScreen('end-screen');
}

function restartGame() {
    startGame();
}