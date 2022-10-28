/* 
Clean up the interface to allow players to put in their names, include a button to start/restart the game and add a display element that congratulates the winning player!
*/
const gameDisplay = document.getElementById('gameDisplay');
const cellsDisplay = document.getElementById('cells');
const turnDisplay = document.getElementById('turnDisplay');
const playerInput = document.getElementById('playerInput');
const gameControls = document.getElementById('gameControls');
const winnerDisplay = document.getElementById('congrats');
const pxDisplay = gameControls.querySelector('#pxDisplay');
const poDisplay = gameControls.querySelector('#poDisplay');

//displayController
const displayController = (() => {
  const renderBoard = (doc, board) => {
    const display = doc.querySelector('#cells');

    [...display.children].map((cell, idx) => {
      let played = board[idx] || '';
      cell.textContent = played;
    });
  };

  const displayTurn = (player) => {
    turnDisplay.querySelector('#turnPlayer').textContent =
      (player || 'no one') + "'s";
  };

  const updateScores = (game) => {
    let players = Object.keys(game);
    let playerX =
      game[players[0]].mark === 'X'
        ? players.splice(0, 1)[0]
        : players.splice(1, 1)[0];
    let playerO = players[0];
    pxDisplay.textContent = `${playerX}: ${game[playerX].score}`;
    poDisplay.textContent = `${playerO}: ${game[playerO].score}`;
  };

  const showGameDisplay = (gDisplay) => {
    gDisplay.classList.remove('hidden');
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

  const toggleWinnerDisplay = (wDisplay, winner) => {
    wDisplay.children[1].textContent = winner || '';
    if (winner === '') wDisplay.classList.add('hidden');
    if (winner) wDisplay.classList.remove('hidden');
  };

  return {
    renderBoard,
    togglePlayerInput,
    toggleGameControls,
    updateScores,
    showGameDisplay,
    toggleWinnerDisplay,
    displayTurn,
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
    displayController.toggleWinnerDisplay(winnerDisplay, '');
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
  let _turn = 'O';
  let _turnPlayer = '';
  let _players = [];
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

  const addPlayers = (player1, player2) => {
    _players[0] = player1 || 'Player1';
    _players[1] = player2 || 'Player2';
    _game[_players[0]] = { mark: 'X', score: 0, plays: [] };
    _game[_players[1]] = { mark: 'O', score: 0, plays: [] };
    changeTurn();
    displayController.updateScores(_game);
  };

  const init = () => {
    _over = false;
    _game = {};
    _players = [];
    displayController.togglePlayerInput(playerInput);
  };

  const changeTurn = () => {
    _turn = _turn === 'X' ? 'O' : 'X';
    _turnPlayer = _game[_players[0]].mark === _turn ? _players[0] : _players[1];
    displayController.displayTurn(_turnPlayer);
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
      _game[winner[0]].score = ++_game[winner[0]].score || 1;
      displayController.updateScores(_game);
      displayController.toggleWinnerDisplay(winnerDisplay, winner[0]);
      displayController.displayTurn();
      _over = true;
    } else {
      changeTurn();
    }
  };

  const play = (idx) => {
    if (!_over) {
      gameBoard.write(_turn, idx, displayController);
      _game[_turnPlayer].plays.push(idx);
      if (
        _game[_players[0]].plays.length >= 3 ||
        _game[_players[1]].plays.length >= 3
      ) {
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
    changeTurn();
    _game[_players[0]].plays = [];
    _game[_players[1]].plays = [];
  };

  const resetScore = () => {
    _game[_players[0]].score = 0;
    _game[_players[1]].score = 0;
    displayController.updateScores(_game);
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
    displayController.showGameDisplay(gameDisplay);
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
