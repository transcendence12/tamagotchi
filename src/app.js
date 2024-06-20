import Game from "./modules/game";

document.addEventListener("DOMContentLoaded", () => {

  const game = new Game();

  // Start game
  game.start({
    healthElement: "#health-point-element",
    hungerElement: "#hunger-point-element",
    energyElement: "#energy-point-element",
    funElement: "#fun-point-element",
    // displayStateInUIelement: ".gameBoy",
    actionButtonsElement: "#action-buttons-group",
    // checkStateChange: game.handleTamagotchiStateChange,

  });
});
