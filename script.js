const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restartButton");

let cells = [];
let score = 0;

// Initialize game
function init() {
    grid.innerHTML = "";
    cells = Array(16).fill(0);
    score = 0;
    scoreDisplay.innerText = score;

    for (let i = 0; i < 16; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        grid.appendChild(tile);
    }

    addRandomTile();
    addRandomTile();

    updateBoard();
}

// Add a random tile (2 or 4)
function addRandomTile() {
    let emptyCells = [];
    cells.forEach((cell, index) => {
        if (cell === 0) {
            emptyCells.push(index);
        }
    });

    if (emptyCells.length > 0) {
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        cells[randomIndex] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Update the board UI
function updateBoard() {
    const tiles = document.querySelectorAll(".tile");

    tiles.forEach((tile, index) => {
        tile.innerText = cells[index] !== 0 ? cells[index] : "";
        tile.className = "tile tile-" + (cells[index] || 0);
    });

    scoreDisplay.innerText = score;
}

// Handle key presses for movement
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
        slideUp();
    } else if (e.key === "ArrowDown") {
        slideDown();
    } else if (e.key === "ArrowLeft") {
        slideLeft();
    } else if (e.key === "ArrowRight") {
        slideRight();
    }
});

// Handle button clicks for mobile controls
document.getElementById("up").addEventListener("click", slideUp);
document.getElementById("down").addEventListener("click", slideDown);
document.getElementById("left").addEventListener("click", slideLeft);
document.getElementById("right").addEventListener("click", slideRight);

// Merge and slide logic for slide functions
function mergeAndSlide(array) {
    const newArray = array.filter(val => val !== 0);
    for (let i = 0; i < newArray.length - 1; i++) {
        if (newArray[i] === newArray[i + 1]) {
            newArray[i] *= 2;
            score += newArray[i];
            newArray.splice(i + 1, 1);
        }
    }
    return [...newArray, ...Array(4 - newArray.length).fill(0)];
}

// Slide functions
function slideUp() {
    for (let col = 0; col < 4; col++) {
        const column = [];
        for (let row = 0; row < 4; row++) {
            column.push(cells[row * 4 + col]);
        }
        const newColumn = mergeAndSlide(column);
        for (let row = 0; row < 4; row++) {
            cells[row * 4 + col] = newColumn[row];
        }
    }
    addRandomTile();
    updateBoard();
}

function slideDown() {
    for (let col = 0; col < 4; col++) {
        const column = [];
        for (let row = 3; row >= 0; row--) {
            column.push(cells[row * 4 + col]);
        }
        const newColumn = mergeAndSlide(column);
        for (let row = 3; row >= 0; row--) {
            cells[row * 4 + col] = newColumn[3 - row];
        }
    }
    addRandomTile();
    updateBoard();
}

function slideLeft() {
    for (let row = 0; row < 4; row++) {
        const rowArray = cells.slice(row * 4, row * 4 + 4);
        const newRow = mergeAndSlide(rowArray);
        for (let col = 0; col < 4; col++) {
            cells[row * 4 + col] = newRow[col];
        }
    }
    addRandomTile();
    updateBoard();
}

function slideRight() {
    for (let row = 0; row < 4; row++) {
        const rowArray = cells.slice(row * 4, row * 4 + 4).reverse();
        const newRow = mergeAndSlide(rowArray);
        for (let col = 0; col < 4; col++) {
            cells[row * 4 + 3 - col] = newRow[col];
        }
    }
    addRandomTile();
    updateBoard();
}

// Add restart functionality
restartButton.addEventListener("click", init);

// Start the game
init();
