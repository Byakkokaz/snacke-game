// ===== INISIALISASI CANVAS =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===== SNAKE =====
let snake = [{ x: 200, y: 60 }];
let dx = 20;
let dy = 0;

// WARNA SNAKE
let snakeColor = "green";

//========= SCORE ========= 
let score = 0;

// LIVES
let lives = 3;

//========= LEVEL ========= 
let level = 1;
// speed game 
let gameSpeed = 250;
// game over 
let gameOver = false;

//========= STATE =========
let gameStarted = false;
let isPaused = false;



//========= GENERATE FOOD ========= 
function generateFood() {

    let newFood;
    let valid = false;

    while (!valid) {

        newFood = {
            x: Math.floor(Math.random() * 20) * 20,
            y: (Math.floor(Math.random() * 18) + 2) * 20
        };

        valid = true;

        for (let part of snake) {

            if (
                part.x === newFood.x &&
                part.y === newFood.y
            ) {
                valid = false;
                break;
            }
        }

        for (let obs of obstacles) {

            if (
                obs.x === newFood.x &&
                obs.y === newFood.y
            ) {
                valid = false;
                break;
            }
        }
    }

    return newFood;
}

//=========GENERATE OBSTACLE
function generateObstacle(total) {

    obstacles = [];

    while (obstacles.length < total) {

        let newObstacle = {
            x: Math.floor(Math.random() * 20) * 20,
            y: (Math.floor(Math.random() * 18) + 2) * 20
        };

        let valid = true;

        for (let part of snake) {

            if (
                part.x === newObstacle.x &&
                part.y === newObstacle.y
            ) {
                valid = false;
                break;
            }
        }

        if (
            food.x === newObstacle.x &&
            food.y === newObstacle.y
        ) {
            valid = false;
        }

        for (let obs of obstacles) {

            if (
                obs.x === newObstacle.x &&
                obs.y === newObstacle.y
            ) {
                valid = false;
                break;
            }
        }

        if (valid) {
            obstacles.push(newObstacle);
        }
    }
}

//==========OBSTACLE==========
let obstacles = [];

//========= FOOD ========= 
let food = generateFood();




//===========DRAW SNAKE===========
function drawSnake() {
    snake.forEach(part => {
        ctx.fillStyle = snakeColor;
        ctx.fillRect(part.x, part.y, 20, 20);
    });
}

//==========DRAW FOOD==========
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);
}

// DRAW OBSTACLE
function drawObstacles() {
    ctx.fillStyle = "gray";
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, 20, 20);
    });
}

//==========DRAW SCORE==========
function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "18px Arial";
    ctx.fillText("Score : " + score, 10, 22);
    ctx.fillText("Level : " + level, 170, 22);
    ctx.fillText("Lives : " + lives, 320, 22);

    // Garis pembatas HUD
    ctx.beginPath();
    ctx.moveTo(0, 40);
    ctx.lineTo(canvas.width, 40);
    ctx.strokeStyle = "black";
    ctx.stroke();
}

//========MOVE SNAKE========
function moveSnake() {
    let head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    // level 5
    if (level !== 5) {

        if (head.x >= canvas.width)
            head.x = 0;


        if (head.x < 0)
            head.x = canvas.width - 20;


        if (head.y >= canvas.height)
            head.y = 40;


        if (head.y < 40)
            head.y = canvas.height - 20;
    }

    // hard mode 
    else {

        if (
            head.x < 0 ||
            head.x >= canvas.width ||
            head.y < 40 ||
            head.y >= canvas.height
        ) {

            lives--;

            if (lives <= 0) {
                gameOver = true;
            } else {
                resetSnake();
            }

            return;
        }
    }
    snake.unshift(head);
    snake.pop();
}

// RESET SNAKE
function resetSnake() {

    snake = [{ x: 200, y: 60 }];

    dx = 20;
    dy = 0;

    food = generateFood();
}

//==========CHECK FOOD==========
function checkFood() {
    if (
        snake[0].x === food.x &&
        snake[0].y === food.y
    ) {
        snake.push({});       // panjangkan snake
        food = generateFood(); // buat makanan baru
        score += 1;
        //update level
        updateLevel();
    }
}

//========== UPDATE LEVEL ==========
function updateLevel() {
    if (score <= 25) {
        level = 1;
        gameSpeed = 250;
        generateObstacle(0);
    }
    else if (score <= 50) {
        level = 2;
        gameSpeed = 200;
        generateObstacle(2);
    }
    else if (score <= 75) {
        level = 3;
        gameSpeed = 150;
        generateObstacle(4);
    }
    else if (score <= 100) {
        level = 4;
        gameSpeed = 100;
        generateObstacle(6);
    }
    else {
        level = 5;
        gameSpeed = 50;
        generateObstacle(8);
    }
}
//COLLISION BODY
function checkCollision() {
    const head = snake[0];

    for (let i = 1; i < snake.length; i++) {

        if (
            head.x === snake[i].x &&
            head.y === snake[i].y
        ) {

            lives--;

            if (lives <= 0) {
                gameOver = true;
            } else {
                resetSnake();
            }
        }
    }
}

//COLLISION OBSTACLE
function checkCollisionObstacle() {

    const head = snake[0];

    obstacles.forEach(obstacle => {

        if (
            head.x === obstacle.x &&
            head.y === obstacle.y
        ) {

            lives--;

            if (lives <= 0) {
                gameOver = true;
            } else {
                resetSnake();
            }
        }

    });
}

// GAME OVER
function drawGameOver() {
    ctx.fillStyle = "black";

    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER", 90, 180);

    ctx.font = "18px Arial";
    ctx.fillText("Press ENTER to Restart", 70, 220);
}

//========= GAME MODE (AI/PLAYER) =========
let isAI = localStorage.getItem("snake_is_ai") === "true";

const playerBtn = document.getElementById("playerBtn");
const aiBtn = document.getElementById("aiBtn");

function updateUI() {
    if (isAI) {
        aiBtn.classList.add("active");
        playerBtn.classList.remove("active");
    } else {
        playerBtn.classList.add("active");
        aiBtn.classList.remove("active");
    }
}

playerBtn.addEventListener("click", () => {
    isAI = false;
    localStorage.setItem("snake_is_ai", "false");
    updateUI();
});

aiBtn.addEventListener("click", () => {
    isAI = true;
    localStorage.setItem("snake_is_ai", "true");
    updateUI();
});

// Set initial button states
updateUI();


//========= AI AUTOPLAY LOGIC (BFS & SURVIVAL FALLBACK) =========

// Get valid neighboring coordinates
function getNeighbors(cell) {
    let neighbors = [];
    let dirs = [
        { dx: 20, dy: 0 },
        { dx: -20, dy: 0 },
        { dx: 0, dy: 20 },
        { dx: 0, dy: -20 }
    ];

    for (let dir of dirs) {
        let nx = cell.x + dir.dx;
        let ny = cell.y + dir.dy;

        if (level !== 5) {
            // Wrap around levels (1-4)
            if (nx >= canvas.width) nx = 0;
            if (nx < 0) nx = canvas.width - 20;
            if (ny >= canvas.height) ny = 40;
            if (ny < 40) ny = canvas.height - 20;
        } else {
            // Level 5 wall boundaries
            if (nx < 0 || nx >= canvas.width || ny < 40 || ny >= canvas.height) {
                continue;
            }
        }
        neighbors.push({ x: nx, y: ny });
    }
    return neighbors;
}

// Check if cell is an obstacle (body or wall/obstacle objects)
function isObstacle(cell) {
    // Check if cell is in snake's body (excluding head)
    for (let i = 1; i < snake.length; i++) {
        if (cell.x === snake[i].x && cell.y === snake[i].y) {
            return true;
        }
    }

    // Check if cell is an obstacle
    for (let obs of obstacles) {
        if (cell.x === obs.x && cell.y === obs.y) {
            return true;
        }
    }

    return false;
}

// Shortest path calculation via Breadth-First Search
function findShortestPath(start, target) {
    let queue = [[start]];
    let visited = new Set();
    visited.add(`${start.x},${start.y}`);

    while (queue.length > 0) {
        let path = queue.shift();
        let curr = path[path.length - 1];

        if (curr.x === target.x && curr.y === target.y) {
            return path;
        }

        let neighbors = getNeighbors(curr);
        for (let neighbor of neighbors) {
            let key = `${neighbor.x},${neighbor.y}`;
            if (!visited.has(key) && !isObstacle(neighbor)) {
                visited.add(key);
                queue.push([...path, neighbor]);
            }
        }
    }
    return null;
}

// Fallback survival: choose cell with largest reachable area size
function getSurvivalMove(start) {
    let neighbors = getNeighbors(start);
    let bestMove = null;
    let maxArea = -1;

    for (let neighbor of neighbors) {
        if (!isObstacle(neighbor)) {
            // Don't turn back immediately if we have a body
            if (snake.length > 1 && neighbor.x === snake[1].x && neighbor.y === snake[1].y) {
                continue;
            }
            let area = countReachableArea(neighbor);
            if (area > maxArea) {
                maxArea = area;
                bestMove = neighbor;
            }
        }
    }
    return bestMove;
}

// Flood fill count to determine safe area size
function countReachableArea(start) {
    let queue = [start];
    let visited = new Set();
    visited.add(`${start.x},${start.y}`);
    let count = 0;

    // Capped at 150 cells for real-time performance
    while (queue.length > 0 && count < 150) {
        let curr = queue.shift();
        count++;

        let neighbors = getNeighbors(curr);
        for (let neighbor of neighbors) {
            let key = `${neighbor.x},${neighbor.y}`;
            if (!visited.has(key) && !isObstacle(neighbor)) {
                visited.add(key);
                queue.push(neighbor);
            }
        }
    }
    return count;
}

// Calculate dx and dy translation with wrap-around safety
function getDirectionTo(fromCell, toCell) {
    let targetDx = toCell.x - fromCell.x;
    let targetDy = toCell.y - fromCell.y;

    if (level !== 5) {
        // Adjust for wrapping coordinates
        if (targetDx < -20) targetDx = 20;
        else if (targetDx > 20) targetDx = -20;

        if (targetDy < -20) targetDy = 20;
        else if (targetDy > 20) targetDy = -20;
    }
    return { dx: targetDx, dy: targetDy };
}

// Main AI loop executor
function makeAIMove() {
    let start = { x: snake[0].x, y: snake[0].y };
    let target = { x: food.x, y: food.y };
    
    let path = findShortestPath(start, target);
    let nextCell = null;
    
    if (path && path.length > 1) {
        nextCell = path[1];
    } else {
        // No path to food? Find a safe survival move.
        nextCell = getSurvivalMove(start);
    }
    
    if (nextCell) {
        let dir = getDirectionTo(start, nextCell);
        dx = dir.dx;
        dy = dir.dy;
    }
}

//KEYBOARD
document.addEventListener("keydown", (event) => {
    const key = event.key;
    
    // Handle pause/resume toggle with Escape key
    if (gameStarted && !gameOver && key === "Escape") {
        event.preventDefault();
        if (isPaused) {
            isPaused = false;
            pauseScreen.classList.add("hidden");
            playBtn.disabled = true;
            pauseBtn.disabled = false;
            gameLoop();
        } else {
            isPaused = true;
            pauseScreen.classList.remove("hidden");
            playBtn.disabled = false;
            pauseBtn.disabled = true;
        }
        return;
    }
    
    // Ignore gameplay controls if game is not active (paused or not started)
    if (!gameStarted || isPaused) {
        if (gameOver && key === "Enter") location.reload();
        return;
    }
    
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
        if (isAI) {
            isAI = false;
            localStorage.setItem("snake_is_ai", "false");
            updateUI();
        }
    }
    if (key === "ArrowUp" && dy === 0) {
        dx = 0;
        dy = -20;
    } else if (key === "ArrowDown" && dy === 0) {
        dx = 0;
        dy = 20;
    } else if (key === "ArrowLeft" && dx === 0) {
        dx = -20;
        dy = 0;
    } else if (key === "ArrowRight" && dx === 0) {
        dx = 20;
        dy = 0;
    }
    // Restart
    if (gameOver && key === "Enter") location.reload();
});

// DOM Elements for Control
const startScreen = document.getElementById("startScreen");
const instructionsScreen = document.getElementById("instructionsScreen");
const pauseScreen = document.getElementById("pauseScreen");
const startBtn = document.getElementById("startBtn");
const guideBtn = document.getElementById("guideBtn");
const backBtn = document.getElementById("backBtn");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const gameCtrlBar = document.getElementById("gameCtrlBar");
const colorOptions = document.querySelectorAll(".color-option");

// Event Listeners for UI Buttons
startBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    playBtn.classList.remove("hidden");
    pauseBtn.classList.remove("hidden");
    gameCtrlBar.classList.add("visible");
    
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    
    gameStarted = true;
    isPaused = false;
    
    updateLevel();
    gameLoop();
});

guideBtn.addEventListener("click", () => {
    startScreen.classList.add("hidden");
    instructionsScreen.classList.remove("hidden");
});

backBtn.addEventListener("click", () => {
    instructionsScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
});

playBtn.addEventListener("click", () => {
    if (gameStarted && isPaused) {
        isPaused = false;
        pauseScreen.classList.add("hidden");
        playBtn.disabled = true;
        pauseBtn.disabled = false;
        gameLoop();
    }
});

pauseBtn.addEventListener("click", () => {
    if (gameStarted && !isPaused) {
        isPaused = true;
        pauseScreen.classList.remove("hidden");
        playBtn.disabled = false;
        pauseBtn.disabled = true;
    }
});

// Color Selection Options
colorOptions.forEach(option => {
    option.addEventListener("click", () => {
        colorOptions.forEach(opt => opt.classList.remove("active"));
        option.classList.add("active");
        snakeColor = option.getAttribute("data-color");
    });
});

// GAME LOOP
function gameLoop() {
    if (!gameStarted || isPaused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gameOver) {
        drawGameOver();
        pauseScreen.classList.add("hidden");
        playBtn.classList.add("hidden");
        pauseBtn.classList.add("hidden");
        gameCtrlBar.classList.remove("visible");
        return;
    }
    if (isAI) {
        makeAIMove();
    }
    moveSnake();
    checkFood();
    checkCollision();
    checkCollisionObstacle();

    drawSnake();
    drawFood();
    drawObstacles();
    drawScore();
    setTimeout(gameLoop, gameSpeed);
}

// Initialize level state only at start
updateLevel();
