var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;
var score = 0;
var highScore = 0;
var gameOver = false;

// Snake and game variables
var snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};

var apple = { x: 320, y: 320 };
var powerUp = { x: -1, y: -1 }; // Initially hidden
var obstacles = [];

// Generate random whole numbers
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Create obstacles
function generateObstacles() {
  obstacles = [];
  for (var i = 0; i < 10; i++) {
    obstacles.push({ x: getRandomInt(0, 25) * grid, y: getRandomInt(0, 25) * grid });
  }
}

generateObstacles();

// Game loop
function loop() {
  if (gameOver) return; // Stop the game loop if game over

  requestAnimationFrame(loop);

  if (++count < 20) return; // Slow down game loop
  count = 0;

  context.clearRect(0, 0, canvas.width, canvas.height);

  // Move snake
  snake.x += snake.dx;
  snake.y += snake.dy;

  // End game if snake touches the border
  if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
    triggerGameOver();
    return;
  }

  snake.cells.unshift({ x: snake.x, y: snake.y });

  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // Draw apple
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  // Draw power-up if visible
  if (powerUp.x !== -1 && powerUp.y !== -1) {
    context.fillStyle = 'gold';
    context.fillRect(powerUp.x, powerUp.y, grid - 1, grid - 1);
  }

  // Draw obstacles
  context.fillStyle = 'gray';
  obstacles.forEach(function(obstacle) {
    context.fillRect(obstacle.x, obstacle.y, grid - 1, grid - 1);
  });

  // Draw snake
  context.fillStyle = 'lime';
  snake.cells.forEach(function(cell, index) {
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    // Check collision with apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;
      document.getElementById('score').textContent = score;

      if (score > highScore) {
        highScore = score;
        document.getElementById('high-score').textContent = highScore;
      }

      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;

      // Occasionally spawn a power-up
      if (Math.random() < 0.3) {
        powerUp.x = getRandomInt(0, 25) * grid;
        powerUp.y = getRandomInt(0, 25) * grid;
      }
    }

    // Check collision with power-up
    if (cell.x === powerUp.x && cell.y === powerUp.y) {
      snake.maxCells += 2;
      powerUp.x = -1;
      powerUp.y = -1;
    }

    // Check collision with obstacles
    obstacles.forEach(function(obstacle) {
      if (cell.x === obstacle.x && cell.y === obstacle.y) {
        triggerGameOver();
      }
    });

    // Check collision with self
    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        triggerGameOver();
      }
    }
  });
}

// Trigger game over
function triggerGameOver() {
  gameOver = true;
  document.getElementById('game-over').style.display = 'block';
}

// Keyboard events
document.addEventListener('keydown', function(e) {
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  } else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  } else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  } else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

// Start the game
requestAnimationFrame(loop);