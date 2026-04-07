const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playerImg = new Image();
playerImg.src = "player.png";

let loseSound = document.getElementById("loseSound");

// player
let player = {
  x: 100,
  y: 200,
  width: 50,
  height: 50,
  gravity: 0.5,
  velocity: 0
};

// pipes
let pipes = [];
let pipeWidth = 60;
let gap = 150;

// game state
let gameOver = false;

// controls
document.addEventListener("keydown", () => {
  player.velocity = -8;
});

// create pipes
function createPipe() {
  let topHeight = Math.random() * (canvas.height - gap);

  pipes.push({
    x: canvas.width,
    top: topHeight
  });
}

// update game
function update() {
  if (gameOver) return;

  player.velocity += player.gravity;
  player.y += player.velocity;

  // collision with ground
  if (player.y > canvas.height) {
    endGame();
  }

  pipes.forEach(pipe => {
    pipe.x -= 3;

    // collision
    if (
      player.x < pipe.x + pipeWidth &&
      player.x + player.width > pipe.x &&
      (player.y < pipe.top ||
        player.y + player.height > pipe.top + gap)
    ) {
      endGame();
    }
  });

  // remove pipes
  pipes = pipes.filter(pipe => pipe.x > -pipeWidth);
}

// draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // player
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

  // pipes
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.top + gap, pipeWidth, canvas.height);
  });
}

// game loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// create pipes every 2 sec
setInterval(createPipe, 2000);

// end game
function endGame() {
  gameOver = true;
  loseSound.play();

  alert("Game Over 😂");
}

loop();