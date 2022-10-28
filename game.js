/* 
Clean up the interface to allow players to put in their names, include a button to start/restart the game and add a display element that congratulates the winning player!
*/
const playerInput = document.getElementById('playerInput');
const gameControls = document.getElementById('gameControls');
const pxDisplay = gameControls.querySelector('#pxDisplay');
const poDisplay = gameControls.querySelector('#poDisplay');

//displayController
const displayController = (() => {
  const renderBoard = (doc, board) => {
    const display = doc.querySelector('#gameDisplay');

    [...display.children].map((cell, idx) => {
      let played = board[idx] || '';
      cell.textContent = played;
    });
  };

  const updateScores = (playerX, playerO) => {
    pxDisplay.textContent = `${playerX.name}: ${playerX.score}`;
    poDisplay.textContent = `${playerO.name}: ${playerO.score}`;
  };

  const togglePlayerInput = (pInput) => {
    pInput.classList.toggle('hidden');
    pInput.onclick =
      pInput.onclick ||
      function (e) {
        if (e.target.classList.contains('commit'))
          inputController.handlePlayerInput(
            e.target.parentElement.parentElement.parentElement
          );
      };
  };

  const toggleGameControls = (gControls) => {
    gControls.classList.toggle('hidden');
    gControls.onclick =
      gControls.onclick ||
      function (e) {
        if (e.target.tagName.toLowerCase() === 'button')
          inputController.handleControls(e.target);
      };
  };

  return {
    renderBoard,
    togglePlayerInput,
    toggleGameControls,
    updateScores,
  };
})();

// gameBoard
const gameBoard = (() => {
  // implement an event emitter on state change call renderBoard
  let _board = [];

  const read = () => _board;

  const write = (mark, idx, displayController) => {
    _board[idx] = mark;
    displayController.renderBoard(document, _board);
  };

  const reset = (displayController) => {
    _board = [];
    displayController.renderBoard(document, []);
  };

  return {
    read,
    write,
    reset,
  };
})();

// gameController
const gameController = (() => {
  let _over = false;
  let _game = {};
  let _turn = 'X';
  const _winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 4, 6],
    [2, 5, 8],
  ];

  const addPlayers = (playerX = 'PlayerX', playerO = 'PlayerO') => {
    _game['X'] = { name: playerX, score: 0, plays: [] };
    _game['O'] = { name: playerO, score: 0, plays: [] };
    displayController.updateScores(_game['X'], _game['O']);
  };

  const init = () => {
    _over = false;
    _game = {};
    _turn = 'X';
    displayController.togglePlayerInput(playerInput);
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
      console.log(
        `Winner is ${_game[winner[0]].name} with ${result[winner[0]]}`
      );
      _game[winner[0]].score = ++_game[winner[0]].score || 1;
      displayController.updateScores(_game['X'], _game['O']);
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
    gameBoard.reset(displayController);
    _over = false;
    _turn = 'X';
    _game['X'].plays = [];
    _game['O'].plays = [];
  };

  const resetScore = () => {
    _game['X'].score = 0;
    _game['O'].score = 0;
    displayController.updateScores(_game['X'], _game['O']);
  };

  const resetGame = () => {
    resetScore();
    startGame();
  };

  return {
    init,
    play,
    startGame,
    resetGame,
    checkWinner,
    addPlayers,
  };
})();

const inputController = (() => {
  const handlePlayerInput = (form) => {
    gameController.addPlayers(form.player1.value, form.player2.value);
    displayController.togglePlayerInput(playerInput);
    displayController.toggleGameControls(gameControls);
  };

  const handleControls = (eventTarget) => {
    if (eventTarget.id === 'restart') {
      gameController.startGame();
    } else if (eventTarget.id === 'reset') {
      gameController.resetGame();
    }
  };

  return {
    handlePlayerInput,
    handleControls,
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

gameController.init();
