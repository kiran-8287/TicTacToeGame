const board = document.getElementById("board");
const message = document.getElementById("message");
const currentPlayer = document.getElementById("currentPlayer");
const playerScore = document.getElementById("playerScore");
const aiScore = document.getElementById("aiScore");

let spaces = Array(9).fill("");
let currentDifficulty = 'easy';
let scores = { player: 0, ai: 0 };
let gameOver = false;
let isPlayerTurn = true;

// Initialize particles
function initParticles() {
  const particlesContainer = document.getElementById('particles');
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.width = Math.random() * 3 + 2 + 'px';
    particle.style.height = particle.style.width;
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
    particlesContainer.appendChild(particle);
  }
}

function setDifficulty(level) {
  currentDifficulty = level;
  document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  resetGame();
}

// Set easy button as active by default
document.addEventListener('DOMContentLoaded', function() {
  const easyBtn = document.querySelector('.difficulty-btn[onclick*="easy"]');
  if (easyBtn) {
    easyBtn.classList.add('active');
  }
});

function drawBoard() {
  board.innerHTML = "";
  spaces.forEach((val, idx) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    if (val === "X") {
      cell.classList.add("x");
      cell.textContent = "×";
    } else if (val === "O") {
      cell.classList.add("o");
      cell.textContent = "○";
    }
    cell.addEventListener("click", () => playerMove(idx));
    board.appendChild(cell);
  });
}

function playerMove(idx) {
  if (spaces[idx] === "" && !gameOver && isPlayerTurn) {
    spaces[idx] = "O";
    isPlayerTurn = false;
    currentPlayer.textContent = "AI Thinking...";
    drawBoard();
    
    if (checkWinner("O")) {
      endGame("You win! 🎉", "player");
    } else if (checkTie()) {
      endGame("It's a tie! 🤝", "tie");
    } else {
      setTimeout(computerMove, 800);
    }
  }
}

function computerMove() {
  if (gameOver) return;
  
  let move;
  switch (currentDifficulty) {
    case 'easy':
      move = getRandomMove();
      break;
    case 'medium':
      move = Math.random() < 0.7 ? getSmartMove() : getRandomMove();
      break;
    case 'hard':
      move = getSmartMove();
      break;
    default:
      move = getRandomMove();
  }
  
  spaces[move] = "X";
  isPlayerTurn = true;
  currentPlayer.textContent = "Your Turn";
  drawBoard();
  
  if (checkWinner("X")) {
    endGame("AI wins! 😓", "ai");
  } else if (checkTie()) {
    endGame("It's a tie! 🤝", "tie");
  }
}

function getRandomMove() {
  let emptyIndices = spaces.map((val, i) => val === "" ? i : null).filter(i => i !== null);
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

function getSmartMove() {
  // Try to win
  for (let i = 0; i < 9; i++) {
    if (spaces[i] === "") {
      spaces[i] = "X";
      if (checkWinner("X")) {
        spaces[i] = "";
        return i;
      }
      spaces[i] = "";
    }
  }
  
  // Block player from winning
  for (let i = 0; i < 9; i++) {
    if (spaces[i] === "") {
      spaces[i] = "O";
      if (checkWinner("O")) {
        spaces[i] = "";
        return i;
      }
      spaces[i] = "";
    }
  }
  
  // Take center if available
  if (spaces[4] === "") return 4;
  
  // Take corners if available
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => spaces[i] === "");
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }
  
  // Take any available edge
  const edges = [1, 3, 5, 7];
  const availableEdges = edges.filter(i => spaces[i] === "");
  if (availableEdges.length > 0) {
    return availableEdges[Math.floor(Math.random() * availableEdges.length)];
  }
  
  return getRandomMove();
}

function checkWinner(symbol) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
  ];
  
  for (let pattern of winPatterns) {
    if (pattern.every(idx => spaces[idx] === symbol)) {
      // Highlight winning cells
      pattern.forEach(idx => {
        const cell = board.children[idx];
        cell.classList.add('winning');
      });
      return true;
    }
  }
  return false;
}

function checkTie() {
  return spaces.every(cell => cell !== "");
}

function endGame(messageText, result) {
  gameOver = true;
  message.textContent = messageText;
  
  if (result === "player") {
    scores.player++;
    playerScore.textContent = scores.player;
  } else if (result === "ai") {
    scores.ai++;
    aiScore.textContent = scores.ai;
  }
  
  currentPlayer.textContent = "Game Over";
}

function resetGame() {
  spaces = Array(9).fill("");
  message.textContent = "";
  gameOver = false;
  isPlayerTurn = true;
  currentPlayer.textContent = "Your Turn";
  drawBoard();
}

function resetScores() {
  scores = { player: 0, ai: 0 };
  playerScore.textContent = "0";
  aiScore.textContent = "0";
  resetGame();
}

// Initialize the game
initParticles();
drawBoard();
