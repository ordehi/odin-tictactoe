/* Build the functions that allow players to add marks to a specific spot on the board, and then tie it to the DOM, letting players click on the gameboard to place their marker. Don’t forget the logic that keeps players from playing in spots that are already taken! */

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

// Player
const Player = (name, score) => {
  return { name, score };
};
