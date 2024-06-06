import Tamagotchi from "./modules/tamagotchi.js";

export default class Game {
  constructor() {
    this.tamagotchi = new Tamagotchi();
    this.displayActionsUI;
  }

  start = ({
    healthElement,
    hungerElement,
    energyElement,
    funElement,
    checkStateChange,
    actionButtonsElement,
  }) => {
    this.tamagotchi.mount({
      healthElement,
      hungerElement,
      energyElement,
      funElement,
      checkStateChange,
      actionButtonsElement,
    });
    console.log("Game started");
    this.displayActionsUI();
  };

  handleActions = (e) => {
    const clickedTargetElement = e.target;
    // console.log(clickedTargetElement)

    const clickedTargetBtn = clickedTargetElement.closest("button");
    // console.log(clickedTargetBtn.id)

    if (clickedTargetBtn.id === "sleepingBtn") {
      this.tamagotchi.setAction("sleeping");
    }
  };

  displayActionsUI = () => {
    const actionButtonsElement = document.querySelector(
      "#action-buttons-group"
    );

    actionButtonsElement.addEventListener(
      "click",
      this.handleActions.bind(this)
    );
  };
  // displayRestartUI = () => {}
}
