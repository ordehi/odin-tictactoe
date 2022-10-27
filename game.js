/* 
Clean up the interface to allow players to put in their names, include a button to start/restart the game and add a display element that congratulates the winning player!
*/

// gameBoard
const gameBoard = (() => {
  // implement an event emitter on state change call renderBoard
  const _board = [];

  const read = () => _board;

  const write = (mark, idx, displayController) => {
    _board[idx] = mark;
    displayController.renderBoard(document);
  };

  const reset = (displayController) => {
    _board = [];
    displayController.renderBoard(document);
  };

  return {
    read,
    write,
    reset,
  };
})();

//displayController
const displayController = (() => {
  const renderBoard = (doc) => {
    const board = gameBoard.read();
    const display = doc.querySelector('#gameDisplay');

    board.map((cell, idx) => {
      let cellNode = display.children[idx];
      cellNode.textContent = cell;
    });
  };

  return {
    renderBoard,
  };
})();

// gameController
const gameController = (() => {
  let _over = false;
  const _game = {};
  let _turn = 'X';
  const _winningCombos = [
    [0, 1, 2],
    [2, 3, 4],
    [5, 6, 7],
    [0, 4, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
    [6, 7, 8],
  ];

  const addPlayers = (playerX = 'PlayerX', playerO = 'PlayerO') => {
    _game['X'] = { name: playerX, score: 0, plays: [] };
    _game['O'] = { name: playerO, score: 0, plays: [] };
  };

  const changeTurn = () => {
    _turn = _turn === 'X' ? 'O' : 'X';
  };

  const gameIsOver = () => {
    console.log('game is over, cannot play');
  };

  const checkWinner = (game) => {
    let result = Object.keys(game).reduce((playerResult, player) => {
      let winnerCombo = _winningCombos.find((combo) =>
        combo.every((cell) => game[player].plays.includes(cell))
      );
      if (winnerCombo) {
        playerResult[player] = winnerCombo;
      }
      return playerResult;
    }, {});

    let winner = Object.keys(result);

    if (winner.length) {
      console.log(`Winner is ${winner[0]} with ${result[winner[0]]}`);
      _over = true;
    }
    changeTurn();
  };

  const play = (idx) => {
    if (!_over) {
      gameBoard.write(_turn, idx, displayController);
      _game[_turn].plays.push(idx);
      if (_game[_turn].plays.length >= 3) {
        checkWinner(_game);
      } else {
        changeTurn();
      }
    } else {
      gameIsOver();
    }
  };

  const addScore = (mark) => {
    _game[mark].score = ++_game[mark].score || 1;
  };

  const startGame = () => {
    gameBoard.reset();
  };

  const resetScore = () => {
    if (Object.keys(_game).length) {
      for (player in _game) {
        _game[player].score = 0;
      }
    }
  };

  const resetGame = () => {
    resetScore();
    startGame();
  };

  return {
    addPlayers,
    play,
    startGame,
    resetGame,
    checkWinner,
  };
})();

const gameClickListener = document.addEventListener('click', (e) => {
  if (e.target.classList.contains('cell') && e.target.textContent === '') {
    let idx = [...e.target.parentElement.children].indexOf(e.target);
    gameController.play(idx, displayController);
  }
});

// Player
const Player = (name, score) => {
  return { name, score };
};

gameController.addPlayers();
