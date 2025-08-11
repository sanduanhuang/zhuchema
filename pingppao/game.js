// Game constants
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle properties
const PADDLE_WIDTH = 10, PADDLE_HEIGHT = 80;
const PLAYER_X = 20, AI_X = WIDTH - 30;
let playerY = HEIGHT/2 - PADDLE_HEIGHT/2;
let aiY = HEIGHT/2 - PADDLE_HEIGHT/2;
const PADDLE_SPEED = 5;

// Ball properties
const BALL_SIZE = 14;
let ballX = WIDTH/2 - BALL_SIZE/2;
let ballY = HEIGHT/2 - BALL_SIZE/2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

// Scores
let playerScore = 0;
let aiScore = 0;

// Mouse control for player paddle
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  // Mouse Y within canvas
  let mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT/2;
  // Clamp to canvas
  if (playerY < 0) playerY = 0;
  if (playerY > HEIGHT - PADDLE_HEIGHT) playerY = HEIGHT - PADDLE_HEIGHT;
});

// Draw everything
function draw() {
  // Background
  ctx.fillStyle = "#15181b";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Net
  ctx.strokeStyle = "#444";
  ctx.setLineDash([8, 16]);
  ctx.beginPath();
  ctx.moveTo(WIDTH/2, 0);
  ctx.lineTo(WIDTH/2, HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);

  // Scores
  ctx.font = "32px Arial";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(playerScore, WIDTH/4, 40);
  ctx.fillText(aiScore, WIDTH*3/4, 40);

  // Paddles
  ctx.fillStyle = "#41c7f6";
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillStyle = "#f6a541";
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Ball
  ctx.fillStyle = "#fff";
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);
}

// Update positions
function update() {
  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top/bottom wall collision
  if (ballY < 0) {
    ballY = 0;
    ballSpeedY *= -1;
  }
  if (ballY + BALL_SIZE > HEIGHT) {
    ballY = HEIGHT - BALL_SIZE;
    ballSpeedY *= -1;
  }

  // Player paddle collision
  if (
    ballX <= PLAYER_X + PADDLE_WIDTH &&
    ballY + BALL_SIZE >= playerY &&
    ballY <= playerY + PADDLE_HEIGHT
  ) {
    ballX = PLAYER_X + PADDLE_WIDTH;
    ballSpeedX *= -1;
    // Add some vertical speed based on hit position
    let impact = ((ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2)) / (PADDLE_HEIGHT/2);
    ballSpeedY = impact * 5;
  }

  // AI paddle collision
  if (
    ballX + BALL_SIZE >= AI_X &&
    ballY + BALL_SIZE >= aiY &&
    ballY <= aiY + PADDLE_HEIGHT
  ) {
    ballX = AI_X - BALL_SIZE;
    ballSpeedX *= -1;
    let impact = ((ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2)) / (PADDLE_HEIGHT/2);
    ballSpeedY = impact * 5;
  }

  // Point scored
  if (ballX < 0) {
    aiScore++;
    resetBall(-1);
  }
  if (ballX + BALL_SIZE > WIDTH) {
    playerScore++;
    resetBall(1);
  }

  // AI paddle movement (simple follow)
  let aiCenter = aiY + PADDLE_HEIGHT/2;
  if (aiCenter < ballY + BALL_SIZE/2 - 10) {
    aiY += PADDLE_SPEED;
  } else if (aiCenter > ballY + BALL_SIZE/2 + 10) {
    aiY -= PADDLE_SPEED;
  }
  // Clamp AI paddle to canvas
  if (aiY < 0) aiY = 0;
  if (aiY > HEIGHT - PADDLE_HEIGHT) aiY = HEIGHT - PADDLE_HEIGHT;
}

// Reset ball after score
function resetBall(direction) {
  ballX = WIDTH/2 - BALL_SIZE/2;
  ballY = HEIGHT/2 - BALL_SIZE/2;
  ballSpeedX = direction * 5 * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Main game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();