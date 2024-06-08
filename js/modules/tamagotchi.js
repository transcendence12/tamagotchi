export default class Tamagotchi {
  isInAction = false;
  prevState = "";
  stateChangeCallback = null;
  constructor() {
    this.nextState = "happy";

    this.health = { value: 10, importance: 1 };
    this.hunger = { value: 10, importance: 3 };
    this.energy = { value: 10, importance: 2 };
    this.fun = { value: 10, importance: 4 };

    this.decrementIntervals = {};
    this.incrementIntervals = {};
    console.log("Tamagotchi initialized");
  }

  displayHealth = (elementSelector) => {
    const displayElement = document.querySelector(elementSelector);
    displayElement.innerText = this.health.value;
  };

  displayHunger = (elementSelector) => {
    const displayElement = document.querySelector(elementSelector);
    displayElement.innerText = this.hunger.value;
  };

  displayEnergy = (elementSelector) => {
    const displayElement = document.querySelector(elementSelector);
    displayElement.innerText = this.energy.value;
  };

  displayFun = (elementSelector) => {
    const displayElement = document.querySelector(elementSelector);
    displayElement.innerText = this.fun.value;
  };

  // setState(nextState) {
  //   this.nextState = nextState;
  //   this.displayStateInUI();
  // }

  setState(nextState) {
    this.nextState = nextState;
    if (this.stateChangeCallback) {
      this.stateChangeCallback(nextState);
    }
    this.displayStateInUI();
  }

  setAction = (action) => {
    if (action === "sleeping") {
      if (this.isInAction && this.prevState === "sleeping") {
        this.stopSleeping();
      } else {
        this.startSleeping();
      }
    } else if (action === "eating") {
      if (this.isInAction && this.prevState === "eating") {
        this.stopEating();
      } else {
        this.startEating();
      }
    } else if (action === "playing") {
      if (this.isInAction && this.prevState === "playing") {
        this.stopPlaying();
      } else {
        this.startPlaying();
      }
    }
  };

  startSleeping = () => {
    this.isInAction = true;
    this.prevState = "sleeping";
    this.setState("sleeping");
    this.incrementIntervals.energy = setInterval(() => {
      this.energy.value += 2;
      this.displayEnergy("#energy-point-element");
      if (this.energy.value >= 10) {
        clearInterval(this.incrementIntervals.energy);
        this.energy.value = 10;
      }
    }, 1000);
  };

  stopSleeping = () => {
    this.isInAction = false;
    clearInterval(this.incrementIntervals.energy);
    this.setState("happy");
  };

  startEating = () => {
    this.isInAction = true;
    this.prevState = "eating";
    this.setState("eating");
    this.incrementIntervals.hunger = setInterval(() => {
      this.hunger.value += 2;
      this.displayHunger("#hunger-point-element");
      if (this.hunger.value >= 10) {
        clearInterval(this.incrementIntervals.hunger);
        this.hunger.value = 10;
      }
    }, 1000);
  };

  stopEating = () => {
    this.isInAction = false;
    clearInterval(this.incrementIntervals.hunger);
    this.setState("happy");
  };

  startPlaying = () => {
    this.isInAction = true;
    this.prevState = "playing";
    this.setState("playing");
    this.incrementIntervals.fun = setInterval(() => {
      this.fun.value += 2;
      this.displayFun("#fun-point-element");
      if (this.fun.value >= 10) {
        clearInterval(this.incrementIntervals.fun);
        this.fun.value = 10;
      }
    }, 1000);
    this.decrementIntervals.energy = setInterval(() => {
      this.energy.value -= 1;
      this.displayEnergy("#energy-point-element");
      if (this.energy.value <= 0) {
        this.energy.value = 0;
        this.stopPlaying();
      }
    }, 1000);
  };
  stopPlaying = () => {
    this.isInAction = false;
    clearInterval(this.incrementIntervals.fun);
    clearInterval(this.decrementIntervals.energy);
    this.setState("happy");
  };

  displaySpriteElement = (elementSelector) => {
    const displayElement = document.querySelector(elementSelector);
    displayElement.className = `tamago tamago-${this.nextState}`;
  };

  displayStateDescriptionElement = (elementSelector) => {
    const displayElement = document.querySelector(elementSelector);
    displayElement.textContent = `${this.nextState}`;
  };

  checkStateChange = () => {
    if (this.checkIfHappy()) return;
    if (this.checkIfSad()) return;
    if (this.checkIfHungry()) return;
    if (this.checkIfSleepy()) return;
    if (this.checkIfEating()) return;
    if (this.checkIfPlaying()) return;
    if (this.checkIfSleeping()) return;
    if (this.checkIfDead()) return;
    if (this.nextState != this.prevState) {
      this.displayStateInUI();
    }
  };

  // check each state:
  checkIfHappy = () => {
    if (
      !this.isInAction &&
      this.health.value >= 7 &&
      this.fun.value >= 7 &&
      this.hunger.value >= 7 &&
      this.energy.value >= 7
    ) {
      this.setState("happy");
      return true;
    }
    return false;
  };
  checkIfSad = () => {
    if (!this.isInAction && this.fun.value <= 6 && this.health.value > 0) {
      this.setState("sad");
      return true;
    }
    return false;
  };
  checkIfHungry = () => {
    if (!this.isInAction && this.hunger.value <= 6 && this.health.value > 0) {
      this.setState("hungry");
      return true;
    }
    return false;
  };
  checkIfSleepy = () => {
    if (!this.isInAction && this.energy.value <= 6 && this.health.value > 0) {
      this.setState("sleepy");
      return true;
    }
    return false;
  };
  checkIfEating = () => {
    if (this.isInAction && this.prevState === "eating") {
      this.setState("eating");
      return true;
    }
    return false;
  };

  checkIfPlaying = () => {
    if (this.isInAction && this.prevState === "playing") {
      this.setState("playing");
      return true;
    }
    return false;
  };

  checkIfSleeping = () => {
    if (this.isInAction && this.prevState === "sleeping") {
      this.setState("sleeping");
      return true;
    }
    return false;
  };

  checkIfDead = () => {
    if (this.health.value <= 0) {
      this.setState("dead");
      return true;
    }
    return false;
  };

  // display UI:
  displayStateInUI = () => {
    switch (this.nextState) {
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
  };

  decreaseLifeParams = () => {
    this.decrementIntervals.energy = setInterval(
      this.decreaseEnergy.bind(this),
      2000
    );
    this.decrementIntervals.hunger = setInterval(
      this.decreaseHunger.bind(this),
      1000
    );
    this.decrementIntervals.fun = setInterval(
      this.decreaseFun.bind(this),
      1000
    );
    this.decrementIntervals.health = setInterval(
      this.decreaseHealth.bind(this),
      1000
    );
  };

  decreaseEnergy = () => {
    if (this.energy.value > 0) {
      this.energy.value--;
      if (this.fun.value <= 0 && this.energy.value > 0) {
        this.energy.value--;
      }
      if (this.energy.value < 0) this.energy.value = 0;
      this.displayEnergy("#energy-point-element");
      this.checkStateChange();
    }
  };

  decreaseHunger = () => {
    if (this.hunger.value > 0) {
      this.hunger.value--;
      if (this.hunger.value < 0) this.hunger.value = 0;
      this.displayHunger("#hunger-point-element");
      this.checkStateChange();
    }
  };

  decreaseFun = () => {
    if (this.fun.value > 0) {
      this.fun.value--;
      if (this.fun.value < 0) this.fun.value = 0;
      this.displayFun("#fun-point-element");
      this.checkStateChange();
    }
  };

  decreaseHealth = () => {
    if (this.hunger.value <= 0 || this.energy.value <= 0) {
      if (this.health.value > 0) {
        this.health.value--;
      }
      if (this.health.value < 0) this.health.value = 0;
      this.displayHealth("#health-point-element");
      this.checkStateChange();
    }
  };

  stopDecreasingLifeParams = () => {
    if (
      this.energy.value <= 0 ||
      this.hunger.value <= 0 ||
      this.fun.value <= 0 ||
      this.health.value <= 0
    ) {
      clearInterval(this.decrementIntervals.energy);
      clearInterval(this.decrementIntervals.hunger);
      clearInterval(this.decrementIntervals.fun);
      clearInterval(this.decrementIntervals.health);
    }
  };

  mount = ({ healthElement, hungerElement, energyElement, funElement, stateChangeCallback }) => {
    this.displayHealth(healthElement);
    this.displayHunger(hungerElement);
    this.displayEnergy(energyElement);
    this.displayFun(funElement);
    this.decreaseLifeParams();
    this.checkStateChange();
    this.stateChangeCallback = stateChangeCallback;
  };
}
