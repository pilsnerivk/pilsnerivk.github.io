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

// Implement swipe detection
let startX, startY;

grid.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
});

grid.addEventListener("touchmove", (e) => {
    e.preventDefault(); // Предотвращаем прокрутку страницы
});

grid.addEventListener("touchend", (e) => {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) slideRight(); // Swipe right
        else slideLeft(); // Swipe left
    } else {
        if (deltaY > 0) slideDown(); // Swipe down
        else slideUp(); // Swipe up
    }
});

// Slide functions (unchanged)
function slideUp() {
    for (let col = 0; col < 4; col++) {
        let stack = [];
        for (let row = 0; row < 4; row++) {
            const index = row * 4 + col;
            if (cells[index] !== 0) stack.push(cells[index]);
        }
        mergeTiles(stack);
        for (let row = 0; row < 4; row++) {
            const index = row * 4 + col;
            cells[index] = stack[row] || 0;
        }
    }
    addRandomTile();
    updateBoard();
}

function slideDown() {
    for (let col = 0; col < 4; col++) {
        let stack = [];
        for (let row = 3; row >= 0; row--) {
            const index = row * 4 + col;
            if (cells[index] !== 0) stack.push(cells[index]);
        }
        mergeTiles(stack);
        for (let row = 3; row >= 0; row--) {
            const index = row * 4 + col;
            cells[index] = stack[row] || 0;
        }
    }
    addRandomTile();
    updateBoard();
}

function slideLeft() {
    for (let row = 0; row < 4; row++) {
        let stack = [];
        for (let col = 0; col < 4; col++) {
            const index = row * 4 + col;
            if (cells[index] !== 0) stack.push(cells[index]);
        }
        mergeTiles(stack);
        for (let col = 0; col < 4; col++) {
            const index = row * 4 + col;
            cells[index] = stack[col] || 0;
        }
    }
    addRandomTile();
    updateBoard();
}

function slideRight() {
    for (let row = 0; row < 4; row++) {
        let stack = [];
        for (let col = 3; col >= 0; col--) {
            const index = row * 4 + col;
            if (cells[index] !== 0) stack.push(cells[index]);
        }
        mergeTiles(stack);
        for (let col = 3; col >= 0; col--) {
            const index = row * 4 + col;
            cells[index] = stack[col] || 0;
        }
    }
    addRandomTile();
    updateBoard();
}

function mergeTiles(stack) {
    for (let i = 0; i < stack.length - 1; i++) {
        if (stack[i] === stack[i + 1]) {
            stack[i] *= 2;
            score += stack[i];
            stack.splice(i + 1, 1);
        }
    }
}

// Add restart functionality
restartButton.addEventListener("click", init);

// Start the game
init();
