/* Build the functions that allow players to add marks to a specific spot on the board, and then tie it to the DOM, letting players click on the gameboard to place their marker. Don’t forget the logic that keeps players from playing in spots that are already taken! */

// mockups
const mockDocument = (() => {
  const createElement = () => null;

  return {
    createElement,
  };
})();

const mockDisplay = () => {
  return (querySelector = {
    innerHTML: null,
  });
};

const mockBoard = () => {
  return ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
};

// gameBoard
const gameBoard = (() => {
  // implement an event emitter on state change call renderBoard
  const board = [];

  const write = (mark, idx, displayController) => {
    board[idx] = mark;
    displayController.renderBoard(document, board);
  };

  const reset = (displayController) => {
    board = [];
    displayController.renderBoard(document, board);
  };

  return {
    write,
    reset,
  };
})();

//displayController
const displayController = (() => {
  const renderBoard = (doc, board) => {
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
  const game = {};
  let turn = 'X';

  const addPlayers = (playerX, playerO) => {
    game['X'] = { name: playerX, score: 0 };
    game['O'] = { name: playerO, score: 0 };
  };

  const changeTurn = () => {
    turn = turn === 'X' ? 'O' : 'X';
  };

  const play = (mark, idx) => {
    gameBoard.write(turn, idx, displayController);
    changeTurn();
  };

  const checkWinner = (board) => {
    return null;
  };

  const addScore = (mark) => {
    game[mark].score = ++game[mark].score || 1;
  };

  const startGame = () => {
    gameBoard.reset();
  };

  const resetScore = () => {
    if (Object.keys(game).length) {
      for (player in game) {
        game[player].score = 0;
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
  };
})();

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('cell') && e.target.textContent === '') {
    let idx = [...e.target.parentElement.children].indexOf(e.target);
    gameController.play('X', idx, displayController);
  }
});

// Player
const Player = (name, score) => {
  return { name, score };
};
