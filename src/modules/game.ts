import Tamagotchi from "./tamagotchi";
import { ITamagotchi } from "./tamagotchi";
import { TamagotchiState } from "./tamagotchi";

interface ITamagotchiGame extends ITamagotchi {
  actionButtonsElement: string;
}

export default class Game {
  tamagotchi: Tamagotchi;
  funElement!: string;
  energyElement!: string;
  hungerElement!: string;
  healthElement!: string;
  actionButtonsElement!: string;
  stateChangeCallback: ((state: TamagotchiState) => void) | null = null;

  constructor() {
    this.tamagotchi = new Tamagotchi();
  }

  start = ({
    healthElement,
    hungerElement,
    energyElement,
    funElement,
    stateChangeCallback,
    actionButtonsElement,
  }: ITamagotchiGame) => {
    this.healthElement = healthElement;
    this.hungerElement = hungerElement;
    this.energyElement = energyElement;
    this.funElement = funElement;
    this.stateChangeCallback = stateChangeCallback;
    this.actionButtonsElement = actionButtonsElement;

    this.displayActionsUI();

    this.tamagotchi.mount({
      healthElement,
      hungerElement,
      energyElement,
      funElement,
      stateChangeCallback: this.handleTamagotchiStateChange.bind(this),
    });
    console.log("Game started");
  };

  displayActionsUI = () => {
    const actionButtonsElement = document.querySelector(
      "#action-buttons-group"
    );

    if (!actionButtonsElement) {
      console.error("Element #action-buttons-group not found");
      return;
    }

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
      this.handleActions as EventListener
    );
  };

  handleActions = (e: Event) => {
    const event = e as MouseEvent;
    const clickedTargetElement = e.target as HTMLElement;
    console.log(clickedTargetElement);

    const clickedTargetBtn = clickedTargetElement.closest("button");

    console.log(clickedTargetBtn?.id);

    if (!clickedTargetBtn) return;

    if (clickedTargetBtn.id === "sleepingBtn") {
      this.tamagotchi.setAction("sleeping");
    } else if (clickedTargetBtn.id === "eatingBtn") {
      this.tamagotchi.setAction("eating");
    } else if (clickedTargetBtn.id === "playingBtn") {
      this.tamagotchi.setAction("playing");
    }
  };

  displayRestartUI = () => {
    const actionButtonsElement = document.querySelector(
      "#action-buttons-group"
    );

    if (!actionButtonsElement) {
      console.error("Element #action-buttons-group not found");
      return;
    }
    this.disableActionButtons();
    actionButtonsElement.removeEventListener(
      "click",
      this.handleActions as EventListener
    );
    actionButtonsElement.innerHTML = `<button type="button" class="restart-button" id="restartBtn">Restart</button>`;

    actionButtonsElement.addEventListener(
      "click",
      this.handleRestart as EventListener
    );
  };
  handleRestart = (e: Event) => {
    const event = e as MouseEvent;
    const restartBtnElement = document.querySelector("#restartBtn");
    console.log(restartBtnElement);
    const clickedTargetRestart = e.target as HTMLElement;
    console.log(clickedTargetRestart);
    if (clickedTargetRestart.id === "restartBtn") {
      this.tamagotchi = new Tamagotchi();
      const actionButtonsElement = document.querySelector(
        "#action-buttons-group"
      );
      actionButtonsElement?.removeEventListener(
        "click",
        this.handleRestart as EventListener
      );

      this.displayActionsUI();

      this.start({
        healthElement: this.healthElement,
        hungerElement: this.hungerElement,
        energyElement: this.energyElement,
        funElement: this.funElement,
        stateChangeCallback: this.stateChangeCallback,
        actionButtonsElement: this.actionButtonsElement,
      });
      this.handleTamagotchiStateChange("happy");
      this.tamagotchi.mount({
        healthElement: this.healthElement,
        hungerElement: this.hungerElement,
        energyElement: this.energyElement,
        funElement: this.funElement,
        stateChangeCallback: this.handleTamagotchiStateChange,
      });
    }
  };

  disableActionButtons = () => {
    const actionButtons = document.querySelectorAll(".action");
    actionButtons.forEach((button) => {
      (button as HTMLButtonElement).disabled = true;
    });
  };

  handleTamagotchiStateChange = (state: TamagotchiState) => {
    if (state === "dead") {
      this.displayRestartUI();
    }
  };
}
