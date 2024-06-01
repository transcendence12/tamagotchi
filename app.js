import Game from "./js/game.js";

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();

  // Start game
  game.start({
    healthElement: "#health-point-element",
    hungerElement: "#hunger-point-element",
    energyElement: "#energy-point-element",
    funElement: "#fun-point-element",
  });
});
