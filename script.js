const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const gameOverText = document.getElementById('game-over');

const blockSize = 20;
const canvasSize = 400;
canvas.width = canvasSize;
canvas.height = canvasSize;
let snake = [{ x: 10, y: 10 }];
let apple = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let gameRunning = false;

function drawBlock(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
  ctx.strokeStyle = 'darkgreen';
  ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
}

function drawSnake() {
  snake.forEach((block, index) => {
    const color = index === 0 ? 'green' : 'lightgreen';
    drawBlock(block.x, block.y, color);
  });
}

function drawApple() {
  drawBlock(apple.x, apple.y, 'red');
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  if (head.x === apple.x && head.y === apple.y) {
    generateApple();
  } else {
    snake.pop();
  }
}

function generateApple() {
  let appleX;
  let appleY;

  do {
    appleX = Math.floor(Math.random() * (canvasSize / blockSize));
    appleY = Math.floor(Math.random() * (canvasSize / blockSize));
  } while (
    snake.some((block) => block.x === appleX && block.y === appleY) ||
    (appleX === 0 && appleY === 0) || // 左上角
    (appleX === (canvasSize / blockSize) - 1 && appleY === 0) || // 右上角
    (appleX === 0 && appleY === (canvasSize / blockSize) - 1) || // 左下角
    (appleX === (canvasSize / blockSize) - 1 && appleY === (canvasSize / blockSize) - 1) // 右下角
  );

  apple.x = appleX;
  apple.y = appleY;
}

function handleKeyPress(e) {
  if (!gameRunning) {
    return;
  }

  if (e.key === 'ArrowUp' && dy !== 1) {
    dx = 0;
    dy = -1;
  } else if (e.key === 'ArrowDown' && dy !== -1) {
    dx = 0;
    dy = 1;
  } else if (e.key === 'ArrowLeft' && dx !== 1) {
    dx = -1;
    dy = 0;
  } else if (e.key === 'ArrowRight' && dx !== -1) {
    dx = 1;
    dy = 0;
  }
}

function showGameOver() {
  gameOverText.style.display = 'block';
}

function startGame() {
  gameRunning = true;
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;
  generateApple();
  gameOverText.style.display = 'none';
  startButton.disabled = true;
  restartButton.disabled = true;
}

function endGame() {
  gameRunning = false;
  showGameOver();
  startButton.disabled = false;
  restartButton.disabled = false;
}

function checkCollision() {
  const head = snake[0];
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvasSize / blockSize ||
    head.y >= canvasSize / blockSize ||
    snake.slice(1).some((block) => block.x === head.x && block.y === head.y)
  ) {
    endGame();
  }
}

function gameLoop() {
  if (!gameRunning) {
    return;
  }

  clearCanvas();
  moveSnake();
  checkCollision();
  drawSnake();
  drawApple();
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
document.addEventListener('keydown', handleKeyPress);
setInterval(gameLoop, 100);
