const gameBoard = (function () {
  let _board = ["", "", "", "", "", "", "", "", ""];

  const getField = (index) => {
    return _board[index];
  };

  const setField = (index, sign) => {
    _board[index] = sign;
  };

  const reset = () => {
    for (let i = 0; i < _board.length; i++) {
      _board[i] = "";
    }
  };
  return { getField, setField, reset };
})();

const Player = (name, sign) => {
  return { name, sign };
};

const handleDisplay = (function () {
  function updateGameBoard(boxes) {
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].textContent = gameBoard.getField(i);
    }
  }

  const gameOutput = document.querySelector(".game-output");

  function updateTurn(player) {
    gameOutput.textContent = `${player}'s turn`;
  }

  function updateWinner() {
    let winner = gameController.checkWinner();

    if (winner) {
      if (winner.toLowerCase() === "x") {
        winner = gameController.player1.name;
        updateScore("x");
      } else {
        winner = gameController.player2.name;
        updateScore("o");
      }

      gameOutput.textContent = `${winner} winner!`;
    } else if (gameController.checkDraw()) {
      gameOutput.textContent = `It's a draw!`;
    }
  }

  function updateScore(winner) {
    const player1Score = document.querySelector("#player1-score");
    const player2Score = document.querySelector("#player2-score");
    const playerScore = winner === "x" ? player1Score : player2Score;

    const currentScore = parseInt(playerScore.textContent) || 0;
    playerScore.textContent = currentScore + 1;
  }

  return { updateGameBoard, updateTurn, updateWinner };
})();

const gameController = (function () {
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");

  const boxes = document.querySelectorAll(".box");
  let activePlayer = player1;

  let isGameOver = false;

  boxes.forEach((box) => {
    box.addEventListener("click", () => {
      if (!isGameOver) {
        const index = box.getAttribute("data-index");

        if (gameBoard.getField(index) === "") {
          gameBoard.setField(index, activePlayer.sign);
          changeActivePlayer();
        }

        handleDisplay.updateGameBoard(boxes);
        handleDisplay.updateWinner();

        if (checkWinner() || checkDraw()) {
          isGameOver = true;
        }
      }
    });
  });

  function changeActivePlayer() {
    if (activePlayer === player1) {
      activePlayer = player2;
      handleDisplay.updateTurn(player2.name);
    } else {
      activePlayer = player1;
      handleDisplay.updateTurn(player1.name);
    }
  }

  function checkWinner() {
    const validConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < validConditions.length; i++) {
      const [a, b, c] = validConditions[i];
      if (
        gameBoard.getField(a) &&
        gameBoard.getField(a) === gameBoard.getField(b) &&
        gameBoard.getField(a) === gameBoard.getField(c)
      ) {
        return gameBoard.getField(a);
      }
    }
    return null;
  }

  function checkDraw() {
    for (let i = 0; i < 9; i++) {
      if (!gameBoard.getField(i)) {
        return false;
      }
    }

    return true;
  }

  const resetBtn = document.querySelector(".reset-btn");

  resetBtn.addEventListener("click", () => {
    gameBoard.reset();
    handleDisplay.updateGameBoard(boxes);
    activePlayer = player1;
    handleDisplay.updateTurn(gameController.player1.name);
    isGameOver = false;
  });

  return { activePlayer, checkWinner, checkDraw, player1, player2 };
})();
