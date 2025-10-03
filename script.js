let board = document.querySelectorAll(".board__cell");
let newGameButton = document.querySelector(".game__button");
let scoreXDisplay = document.getElementById("score-x");
let scoreODisplay = document.getElementById("score-o");
let scoreTieDisplay = document.getElementById("score-draw");
let currentPlayer = "X";
let scoreX = 0;
let scoreO = 0;
let scoreTie = 0;

function checkWin() {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let tie = true;
  for(let i=0; i<winConditions.length; i++){
    let condition = winConditions[i];
    const [a, b, c] = condition;
    if(board[a].textContent === "" || board[b].textContent === "" || board[c].textContent === "") {
      tie = false;
    }
        if (board[a].textContent && board[a].textContent === board[b].textContent && board[a].textContent === board[c].textContent) {
            let correctionConstantX1 = 0;
            let correctionConstantY1 = 0;
            let correctionConstantX2 = 0;
            let correctionConstantY2 = 0;
            let correctionConstant = 25;
            if(i<3){
                correctionConstantX1 = -correctionConstant;
                correctionConstantY1 = 0;
                correctionConstantX2 = correctionConstant;
                correctionConstantY2 = 0;
            } else if(i==6){
                correctionConstantX1 = -correctionConstant;
                correctionConstantY1 = -correctionConstant;
                correctionConstantX2 = correctionConstant;
                correctionConstantY2 = correctionConstant;
            }else if(i==7){
                correctionConstantX1 = correctionConstant;
                correctionConstantY1 = -correctionConstant;
                correctionConstantX2 = -correctionConstant;
                correctionConstantY2 = correctionConstant;
            }else{
                correctionConstantX1 = 0;
                correctionConstantY1 = -correctionConstant;
                correctionConstantX2 = 0;
                correctionConstantY2 = correctionConstant;
            }

            drawLineBetweenCells(board[Math.min(a, b, c)], board[Math.max(a, b, c)], correctionConstantX1, correctionConstantY1, correctionConstantX2, correctionConstantY2);
            return board[a].textContent;
        }
    }    
    return tie ? "tie" : null;
       
}

function handleClick(event) {

  const cell = event.target;
  if (cell.textContent !== "") return; // Ignore clicks on filled cells
  cell.style.backgroundColor = "#5a1f77";
  cell.disabled = true;
  cell.textContent = currentPlayer;

  setTimeout(() => {
    const winner = checkWin();

    if (winner) {
        if (winner === "tie") {
            launchConfetti();
            scoreTie = scoreTie + 1;
            scoreTieDisplay.textContent = scoreTie;
            showPopup("Tie!");
        } else {

            launchConfetti();
            if(winner === "X") {
                scoreX = scoreX + 1;
                scoreXDisplay.textContent = scoreX;
            } else {
                scoreO = scoreO + 1;
                scoreODisplay.textContent = scoreO;
            }
            showPopup(`${winner} wins!`);
        }
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
    }, 0);

}

function launchConfetti() {
    confetti({
        particleCount: 1000,
        spread: 100,
        origin: { x: 0.1, y: 0.98 } // left side
    });
    confetti({
        particleCount: 1000,
        spread: 100,
        origin: { x: 0.9, y: 0.98 } // right side
    });
}

function resetGame() {
  board.forEach(cell => {
    cell.textContent = ""
    cell.style.backgroundColor = "#43115B";
    cell.disabled = false;
  });
  currentPlayer = "X";
}

function showPopup(message) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.textContent = message;
  popup.offsetHeight;
  document.body.appendChild(popup);

  requestAnimationFrame(() => {
    popup.classList.add("show");
 });

  setTimeout(() => {
    popup.classList.remove("show");
    popup.classList.add("hide");
  }, 2000);

  setTimeout(() => popup.remove(), 2500);
}

function startNewGame() {
    let result = confirm("Starting a new game will reset the scores.");
    if (result) {
        resetGame();
        showPopup("New Game Started!");
        scoreXDisplay.textContent = "0";
        scoreODisplay.textContent = "0";
        scoreTieDisplay.textContent = "0";
        scoreX = 0;
        scoreO = 0;
        scoreTie = 0;
    }
}

function drawLineBetweenCells(cell1, cell2, correctionConstantX1, correctionConstantY1, correctionConstantX2, correctionConstantY2){
    
    const rect1 = cell1.getBoundingClientRect();
    const rect2 = cell2.getBoundingClientRect();

    // Compute center of each div
    const x1 = rect1.left + rect1.width / 2 + correctionConstantX1;
    const y1 = rect1.top + rect1.height / 2 + correctionConstantY1;
    const x2 = rect2.left + rect2.width / 2 + correctionConstantX2;
    const y2 = rect2.top + rect2.height / 2 + correctionConstantY2;

    drawAnimatedLine(x1, y1, x2, y2);
    setTimeout(()=>{
        removeLine();
        resetGame();
    }, 2000);
}

function drawAnimatedLine(x1, y1, x2, y2) {
    const line = document.createElement("div");
    line.className = "line";

    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx); 

    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    line.style.transform = `rotate(${angle}rad)`;
    document.body.appendChild(line);

    requestAnimationFrame(() => {
        line.style.width = `${length}px`;
    });
}

function removeLine(){
    const line = document.querySelector(".line");
    setTimeout(()=>{
        line.remove();
    }, 0)
}

newGameButton.addEventListener("click", startNewGame);

board.forEach(cell => cell.addEventListener("click", handleClick));