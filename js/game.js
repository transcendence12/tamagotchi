import Tamagotchi from "./modules/tamagotchi.js";

export default class Game {
  constructor() {
    this.tamagotchi = new Tamagotchi();
    this.displayActionsUI();
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
      stateChangeCallback: this.handleTamagotchiStateChange 
    });
    console.log("Game started");

    this.displayActionsUI();
  };

  handleActions = (e) => {
    const clickedTargetElement = e.target;
    // console.log(clickedTargetElement)

    const clickedTargetBtn = clickedTargetElement.closest("button");
    // console.log(clickedTargetBtn.id)
    if (!clickedTargetBtn) return;

    if (clickedTargetBtn.id === "sleepingBtn") {
      this.tamagotchi.setAction("sleeping");
    } else if (clickedTargetBtn.id === "eatingBtn") {
      this.tamagotchi.setAction("eating");
    } else if (clickedTargetBtn.id === "playingBtn") {
      this.tamagotchi.setAction("playing");
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

  // Action buttons should be disabled, and replaced with Restart button
  handleRestart = () => {
    const restartBtnElement = document.querySelector("#restartBtn");
    console.log(restartBtnElement);
    const clickedTargetRestart = e.target;
    console.log(clickedTargetRestart);

    // if(clickedTargetRestart.id === "restartBtn") {

    // }
  };
  disableActionButtons = () => {
    const actionButtons = document.querySelectorAll(".action");
    actionButtons.forEach((button) => {
      button.disabled = true;
    });
  };
  displayRestartUI = () => {
    const actionButtonsElement = document.querySelector(
      "#action-buttons-group"
    );
    this.disableActionButtons();
    actionButtonsElement.removeEventListener("click", this.handleActions);
    actionButtonsElement.innerHTML = `<button type="button" class="restart-button" id="restartBtn">Restart</button>`;

    actionButtonsElement.addEventListener("click", this.handleRestart);
  };

  handleTamagotchiStateChange = (state) => {
    if (state === "dead") {
      this.displayRestartUI();
    }
  };
}
