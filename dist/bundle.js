"use strict";
(() => {
  // src/modules/tamagotchi.ts
  var Tamagotchi = class {
    funElement;
    energyElement;
    hungerElement;
    healthElement;
    stateChangeCallback = null;
    state;
    action;
    health;
    hunger;
    energy;
    fun;
    number;
    parametersDecreaseInterval;
    constructor() {
      this.state = "happy";
      this.action = null;
      this.health = { value: 10, importance: 1 };
      this.hunger = { value: 10, importance: 3 };
      this.energy = { value: 10, importance: 2 };
      this.fun = { value: 10, importance: 4 };
      this.number = 0;
      this.parametersDecreaseInterval = setInterval(() => {
        this.number += 1;
        this.decreaseLifeParams();
        this.increaseLifeParams();
        this.checkStateChange();
      }, 1e3);
      console.log("Tamagotchi initialized");
    }
    decreaseLifeParams = () => {
      if (this.state === "dead") return;
      if (this.number % 2 === 0) {
        this.energy.value = Math.max(this.energy.value - 1, 0);
        if (this.fun.value <= 0) {
          this.energy.value = Math.max(this.energy.value - 1, 0);
        }
        this.displayEnergy("#energy-point-element");
      }
      this.hunger.value = Math.max(this.hunger.value - 1, 0);
      this.fun.value = Math.max(this.fun.value - 1, 0);
      if (this.hunger.value <= 0 || this.energy.value <= 0) {
        this.health.value = Math.max(this.health.value - 1, 0);
      }
      this.displayHunger("#hunger-point-element");
      this.displayFun("#fun-point-element");
      this.displayHealth("#health-point-element");
      console.log("Parameters decreased:", {
        health: this.health.value,
        hunger: this.hunger.value,
        energy: this.energy.value,
        fun: this.fun.value
      });
      if (this.health.value <= 0) {
        this.setState("dead");
      }
    };
    increaseLifeParams = () => {
      if (this.state === "dead" || !this.action) return;
      console.log("Increasing life parameters...");
      if (this.action === "eating") {
        this.hunger.value = Math.min(this.hunger.value + 2, 10);
        this.displayHunger("#hunger-point-element");
      }
      if (this.action === "sleeping") {
        this.energy.value = Math.min(this.energy.value + 2, 10);
        this.displayEnergy("#energy-point-element");
      }
      if (this.action === "playing") {
        this.fun.value = Math.min(this.fun.value + 2, 10);
        this.displayFun("#fun-point-element");
        this.energy.value = Math.max(this.energy.value - 1, 0);
        this.displayEnergy("#energy-point-element");
      }
      console.log("Parameters increased:", {
        health: this.health.value,
        hunger: this.hunger.value,
        energy: this.energy.value,
        fun: this.fun.value
      });
    };
    displayHealth = (elementSelector) => {
      const displayElement = document.querySelector(
        elementSelector
      );
      if (displayElement) {
        displayElement.innerText = this.health.value + "";
        this.updateDisplayClass(displayElement, this.health.value);
      } else {
        console.error(`Element not found: ${elementSelector}`);
      }
    };
    displayHunger = (elementSelector) => {
      const displayElement = document.querySelector(
        elementSelector
      );
      if (displayElement) {
        displayElement.innerText = this.hunger.value + "";
        this.updateDisplayClass(displayElement, this.hunger.value);
      } else {
        console.error(`Element not found: ${elementSelector}`);
      }
    };
    displayEnergy = (elementSelector) => {
      const displayElement = document.querySelector(
        elementSelector
      );
      if (displayElement) {
        displayElement.innerText = this.energy.value + "";
        this.updateDisplayClass(displayElement, this.energy.value);
      } else {
        console.error(`Element not found: ${elementSelector}`);
      }
    };
    displayFun = (elementSelector) => {
      const displayElement = document.querySelector(
        elementSelector
      );
      if (displayElement) {
        displayElement.innerText = this.fun.value + "";
        this.updateDisplayClass(displayElement, this.fun.value);
      } else {
        console.error(`Element not found: ${elementSelector}`);
      }
    };
    updateDisplayClass(displayElement, value) {
      if (value === 10) {
        displayElement.classList.add("displayValueSmall");
      } else {
        displayElement.classList.remove("displayValueSmall");
      }
    }
    // NIC NIE ZMIENIA ZDEJMOWANIE STANU?
    // removeDisplayingState = () => {
    //   const spriteElement = document.querySelector("#sprite-image");
    //   const stateDescriptionElement = document.querySelector("#tamagoStateDescription");
    //   if (spriteElement) {
    //     spriteElement.className = "";
    //   }
    //   if (stateDescriptionElement) {
    //     stateDescriptionElement.textContent = "";
    //   }
    // };
    setState(state) {
      if (this.state === "dead") return;
      console.log(`Changing state from ${this.state} to ${state}`);
      if (state === "dead" || this.health.value <= 0) {
        this.state = "dead";
        this.health.value = 0;
        this.hunger.value = 0;
        this.energy.value = 0;
        this.fun.value = 0;
        this.stopMainInterval();
      } else {
        this.state = state;
      }
      if (this.stateChangeCallback) {
        this.stateChangeCallback(state);
      }
      this.displayStateInUI();
    }
    setAction = (action) => {
      if (this.state === "dead") return;
      console.log(`setAction called with action: ${action}`);
      if (this.action === action) {
        this.action = null;
        this.setState(this.state);
      } else {
        this.action = action;
        this.setState(action);
      }
      console.log(`Action set: ${this.action}, Current state: ${this.state}`);
    };
    displaySpriteElement = (elementSelector) => {
      const displayElement = document.querySelector(elementSelector);
      if (displayElement) {
        displayElement.className = `tamago tamago-${this.state}`;
        console.log(`Class set to: tamago tamago-${this.state}`);
      } else {
        console.error(`Element not found: ${elementSelector}`);
      }
    };
    displayStateDescriptionElement = (elementSelector) => {
      const displayElement = document.querySelector(
        elementSelector
      );
      displayElement.textContent = `${this.state}`;
    };
    checkStateChange = () => {
      if (this.state === "dead") return;
      if (this.checkIfDead()) return;
      if (this.checkIfHappy()) return;
      if (this.checkIfSad()) return;
      if (this.checkIfHungry()) return;
      if (this.checkIfSleepy()) return;
      this.displayStateInUI();
    };
    checkIfHappy = () => {
      if (this.health.value >= 7 && this.fun.value >= 7 && this.hunger.value >= 7 && this.energy.value >= 7 && this.state !== "dead") {
        this.setState("happy");
        return true;
      }
      return false;
    };
    checkIfSad = () => {
      if (this.fun.value <= 6) {
        this.setState("sad");
        console.log("I'm SAD");
        return true;
      }
      return false;
    };
    checkIfHungry = () => {
      if (this.hunger.value <= 6) {
        this.setState("hungry");
        console.log("I'm HUNGRY");
        return true;
      }
      return false;
    };
    checkIfSleepy = () => {
      if (this.energy.value <= 6) {
        this.setState("sleepy");
        console.log("I'm SLEEPY");
        return true;
      }
      return false;
    };
    checkIfDead = () => {
      if (this.health.value <= 0) {
        this.setState("dead");
        console.log("I'm DEAD");
        return true;
      }
      return false;
    };
    displayStateInUI = () => {
      switch (this.state) {
        case "happy":
        case "sad":
        case "hungry":
        case "sleepy":
        case "eating":
        case "playing":
        case "sleeping":
        case "dead":
          this.displaySpriteElement("#sprite-image");
          this.displayStateDescriptionElement("#tamagoStateDescription");
          break;
        default:
          break;
      }
      console.log(`Displayed state: ${this.state}`);
    };
    stopMainInterval = () => {
      clearInterval(this.parametersDecreaseInterval);
      console.log("Stopped main interval");
    };
    onStateChange(callback) {
      this.stateChangeCallback = callback;
    }
    mount = ({
      healthElement,
      hungerElement,
      energyElement,
      funElement,
      stateChangeCallback
    }) => {
      this.displayHealth(healthElement);
      this.displayHunger(hungerElement);
      this.displayEnergy(energyElement);
      this.displayFun(funElement);
      this.stateChangeCallback = stateChangeCallback;
    };
  };

  // src/modules/game.ts
  var Game = class {
    tamagotchi;
    funElement;
    energyElement;
    hungerElement;
    healthElement;
    actionButtonsElement;
    stateChangeCallback = null;
    constructor() {
      this.tamagotchi = new Tamagotchi();
    }
    start = ({
      healthElement,
      hungerElement,
      energyElement,
      funElement,
      stateChangeCallback,
      actionButtonsElement
    }) => {
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
        stateChangeCallback: this.handleTamagotchiStateChange.bind(this)
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
        this.handleActions
      );
    };
    handleActions = (e) => {
      const event = e;
      const clickedTargetElement = e.target;
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
        this.handleActions
      );
      actionButtonsElement.innerHTML = `<button type="button" class="restart-button" id="restartBtn">Restart</button>`;
      actionButtonsElement.addEventListener(
        "click",
        this.handleRestart
      );
    };
    handleRestart = (e) => {
      const event = e;
      const restartBtnElement = document.querySelector("#restartBtn");
      console.log(restartBtnElement);
      const clickedTargetRestart = e.target;
      console.log(clickedTargetRestart);
      if (clickedTargetRestart.id === "restartBtn") {
        this.tamagotchi = new Tamagotchi();
        const actionButtonsElement = document.querySelector(
          "#action-buttons-group"
        );
        actionButtonsElement?.removeEventListener(
          "click",
          this.handleRestart
        );
        this.displayActionsUI();
        this.start({
          healthElement: this.healthElement,
          hungerElement: this.hungerElement,
          energyElement: this.energyElement,
          funElement: this.funElement,
          stateChangeCallback: this.stateChangeCallback,
          actionButtonsElement: this.actionButtonsElement
        });
        this.handleTamagotchiStateChange("happy");
        this.tamagotchi.mount({
          healthElement: this.healthElement,
          hungerElement: this.hungerElement,
          energyElement: this.energyElement,
          funElement: this.funElement,
          stateChangeCallback: this.handleTamagotchiStateChange
        });
      }
    };
    disableActionButtons = () => {
      const actionButtons = document.querySelectorAll(".action");
      actionButtons.forEach((button) => {
        button.disabled = true;
      });
    };
    handleTamagotchiStateChange = (state) => {
      if (state === "dead") {
        this.displayRestartUI();
      }
    };
  };

  // src/app.ts
  document.addEventListener("DOMContentLoaded", () => {
    const game = new Game();
    game.start({
      healthElement: "#health-point-element",
      hungerElement: "#hunger-point-element",
      energyElement: "#energy-point-element",
      funElement: "#fun-point-element",
      stateChangeCallback: game.handleTamagotchiStateChange.bind(game),
      // displayStateInUIelement: ".gameBoy",
      actionButtonsElement: "#action-buttons-group"
    });
  });
})();
