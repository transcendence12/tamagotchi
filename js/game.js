import Tamagotchi from "./modules/tamagotchi.js";

export default class Game {
  tamagotchi;
  constructor() {
    this.tamagotchi = new Tamagotchi();
  }

  start = ({
    healthElement,
    hungerElement,
    energyElement,
    funElement,
    displayStateInUIelement,
    // checkStateChange,
    actionButtonsElement,
  }) => {
    this.healthElement = healthElement;
    this.hungerElement = hungerElement;
    this.energyElement = energyElement;
    this.funElement = funElement;
    this.displayStateInUIelement = displayStateInUIelement;
    // this.checkStateChange = checkStateChange;
    this.actionButtonsElement = actionButtonsElement;

    this.displayActionsUI();

    this.tamagotchi.mount({
      healthElement,
      hungerElement,
      energyElement,
      funElement,
      displayStateInUIelement,
      stateChangeCallback: this.handleTamagotchiStateChange,
    });
    console.log("Game started");
  };

  handleActions = (e) => {
    const clickedTargetElement = e.target;
    console.log(clickedTargetElement);

    const clickedTargetBtn = clickedTargetElement.closest("button");
    console.log(clickedTargetBtn.id);
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

    actionButtonsElement.innerHTML = `
      <button id="eatingBtn" type="button" class="action">
        <img class="action-icon-inside" src="./public/assets/icons/Hunger.svg" />
      </button>
      <button id="sleepingBtn" type="button" class="action">
        <img class="action-icon-inside" src="./public/assets/icons/Sleep.svg" />
      </button>
      <button id="playingBtn" type="button" class="action">
        <img class="action-icon-inside" src="./public/assets/icons/Fun.svg" />
      </button>
    `;
    actionButtonsElement.addEventListener(
      "click",
      this.handleActions.bind(this)
    );
  };
  // restart handler:
  handleRestart = (e) => {
    const restartBtnElement = document.querySelector("#restartBtn");
    console.log(restartBtnElement);
    const clickedTargetRestart = e.target;
    console.log(clickedTargetRestart);

    if (clickedTargetRestart.id === "restartBtn") {
      this.tamagotchi = new Tamagotchi();
      const actionButtonsElement = document.querySelector(
        "#action-buttons-group"
      );
      actionButtonsElement.removeEventListener(
        "click",
        this.handleRestart.bind(this)
      );

      this.displayActionsUI();
      this.start({
        healthElement: this.healthElement,
        hungerElement: this.hungerElement,
        energyElement: this.energyElement,
        funElement: this.funElement,
        displayStateInUIelement: this.displayStateInUIelement,
        // checkStateChange: this.checkStateChange,
        actionButtonsElement: this.actionButtonsElement,
      });
      // this.handleTamagotchiStateChange();
      // this.tamagotchi.mount({
      //   healthElement: this.healthElement,
      //   hungerElement: this.hungerElement,
      //   energyElement: this.energyElement,
      //   funElement: this.funElement,
      //   displayStateInUIelement: this.displayStateInUIelement,
      //   // checkStateChange: this.checkStateChange,
      //   stateChangeCallback: this.handleTamagotchiStateChange,
      // });
    }
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
    actionButtonsElement.removeEventListener(
      "click",
      this.handleActions.bind(this)
    );
    actionButtonsElement.innerHTML = `<button type="button" class="restart-button" id="restartBtn">Restart</button>`;

    actionButtonsElement.addEventListener(
      "click",
      this.handleRestart.bind(this)
    );
  };

  handleTamagotchiStateChange = (state) => {
    if (state === "dead") {
      this.displayRestartUI();
    }
  };
}
