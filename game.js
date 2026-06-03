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
    ctx.font = "12px Arial";
    ctx.fillText("1-5 : Change Color", 10, 38);

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
    if (score < 5) {
        level = 1;
        gameSpeed = 250;
        generateObstacle(0);
    }
    else if (score < 10) {
        level = 2;
        gameSpeed = 200;
        generateObstacle(2);
    }
    else if (score < 15) {
        level = 3;
        gameSpeed = 150;
        generateObstacle(4);
    }
    else if (score < 20) {
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

//KEYBOARD
document.addEventListener("keydown", (event) => {
    const key = event.key;
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
    // GANTI WARNA SNAKE
    if (key === "1") {
        snakeColor = "green";
    }
    else if (key === "2") {
        snakeColor = "blue";
    }
    else if (key === "3") {
        snakeColor = "purple";
    }
    else if (key === "4") {
        snakeColor = "orange";
    }
    else if (key === "5") {
        snakeColor = "black";
    }
    // Restart
    if (gameOver && key === "Enter") location.reload();
});

// GAME LOOP
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (gameOver) {
        drawGameOver();
        return;
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

// Mulai game
updateLevel();
gameLoop();
