export default class Tamagotchi {
  stateChangeCallback = null;

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
    }, 1000);

    console.log("Tamagotchi initialized");
  }

  decreaseLifeParams = () => {
    if (this.state === "dead") return;

    // Spadek energii o 1 punkt co 2 sekundy
    if (this.number % 2 === 0) {
      this.energy.value = Math.max(this.energy.value - 1, 0);

      // Dodatkowy spadek energii o 1 punkt co 2 sekundy, jeśli fun jest <= 0
      if (this.fun.value <= 0) {
        this.energy.value = Math.max(this.energy.value - 1, 0);
      }

      this.displayEnergy("#energy-point-element");
    }

    // Spadek głodu, zabawy i zdrowia co 1 sekundę
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
      fun: this.fun.value,
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
      fun: this.fun.value,
    });

    // this.displayHealth("#health-point-element");
    // this.displayHunger("#hunger-point-element");
    // this.displayEnergy("#energy-point-element");
    // this.displayFun("#fun-point-element");
  };

  displayHealth = (elementSelector) => {
    const displayElement = document.querySelector(elementSelector);
    displayElement.innerText = this.health.value;
    this.updateDisplayClass(displayElement, this.health.value);
  };

  displayHunger = (elementSelector) => {
    const displayElement = document.querySelector(elementSelector);
    displayElement.innerText = this.hunger.value;
    this.updateDisplayClass(displayElement, this.hunger.value);
  };

  displayEnergy = (elementSelector) => {
    const displayElement = document.querySelector(elementSelector);
    displayElement.innerText = this.energy.value;
    this.updateDisplayClass(displayElement, this.energy.value);
  };

  displayFun = (elementSelector) => {
    const displayElement = document.querySelector(elementSelector);
    displayElement.innerText = this.fun.value;
    this.updateDisplayClass(displayElement, this.fun.value);
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

    // this.removeDisplayingState();

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
    // this.increaseLifeParams()
  };

  // setAction = (action) => {
  //   if (this.state === "dead") return;

  //   console.log(`setAction called with action: ${action}`);
  //   this.action = action;

  //   if (action === "sleeping" && this.state !== "sleeping") {
  //     this.setState("sleeping");
  //   } else if (action === "eating" && this.state !== "eating") {
  //     this.setState("eating");
  //   } else if (action === "playing" && this.state !== "playing") {
  //     this.setState("playing");
  //   }

  //   console.log(`Action set: ${this.action}, Current state: ${this.state}`);
  //   this.increaseLifeParams();
  // };

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
    const displayElement = document.querySelector(elementSelector);
    displayElement.textContent = `${this.state}`;
  };

  checkStateChange = () => {
    if (this.state === "dead") return;

    if (this.checkIfDead()) return;
    if (this.checkIfHappy()) return;
    if (this.checkIfSad()) return;
    if (this.checkIfHungry()) return;
    if (this.checkIfSleepy()) return;

    // this.removeDisplayingState();
    this.displayStateInUI();
  };

  checkIfHappy = () => {
    if (
      this.health.value >= 7 &&
      this.fun.value >= 7 &&
      this.hunger.value >= 7 &&
      this.energy.value >= 7 &&
      this.state !== "dead"
    ) {
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
    displayStateInUIelement,
    stateChangeCallback,
  }) => {
    this.displayHealth(healthElement);
    this.displayHunger(hungerElement);
    this.displayEnergy(energyElement);
    this.displayFun(funElement);
    this.displayStateInUI(displayStateInUIelement);
    this.stateChangeCallback = stateChangeCallback;
    // this.onStateChange(stateChangeCallback);
  };
}
