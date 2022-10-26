/* Set up your HTML and write a JavaScript function that will render the contents of the gameboard array to the webpage (for now you can just manually fill in the array with "X"s and "O"s) */

// gameBoard
const gameBoard = (() => {
  const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];

  return {
    board,
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

const displayController = ((board) => {
  const renderBoard = (doc) => {
    const display = doc.querySelector('#gameDisplay');

    board.map((cell, idx) => {
      let cellNode = display.children[idx];
      cellNode.textContent = cell;
    });
  };

  return {
    renderBoard,
  };
})(gameBoard.board || mockBoard);

// Player
const Player = (name, score) => {
  return { name, score };
};
