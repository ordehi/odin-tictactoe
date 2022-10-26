/* You’re going to store the gameboard as an array inside of a Gameboard object, so start there! Your players are also going to be stored in objects… and you’re probably going to want an object to control the flow of the game itself. */

// gameBoard
const gameBoard = (() => {
  const board = [];

  return {
    board,
  };
})();

//displayController
const displayController = (() => {
  const display = [];

  return {
    display,
  };
})();

// Player
const Player = (name, score) => {
  return { name, score };
};
