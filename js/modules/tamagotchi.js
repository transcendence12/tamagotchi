export default class Tamagotchi {
  constructor() {
    this.state = "playing";

    this.health = { value: 10, importance: 1 };
    this.hunger = { value: 10, importance: 3 };
    this.energy = { value: 10, importance: 2 };
    this.fun = { value: 10, importance: 4 };

    this.decrementIntervals = {};
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

  setState(state){
    this.state = state;
  };

  displaySpriteElement = (elementSelector) => {
    const displayElement = document.querySelector(elementSelector);
    displayElement.className = `tamago tamago-${this.state}`;
  };

  displayStateDescriptionElement = (elementSelector) => {
    const displayElement = document.querySelector(elementSelector);
    displayElement.textContent = `${this.state}`;
  };

  checkStateChange = () => {
    this.checkIfHappy();
    this.checkIfSad();
    this.checkIfHungry();
    this.checkIfSleepy();
    this.checkIfEating();
    this.checkIfPlaying();
    this.checkIfSleeping();
    this.checkIfDead();
    this.displayStateInUI();
  };

  // check each state:
  checkIfHappy = () => {
    if (
      this.health.value >= 7 &&
      this.fun.value >= 7 &&
      this.hunger.value >= 7 &&
      this.energy.value >= 7
    ) {
      this.setState("happy");
    }
  };
  checkIfSad = () => {
    if (this.fun.value <= 6) {
      this.setState("sad");
    }
  };
  checkIfHungry = () => {
    if (this.hunger.value <= 6) {
      this.setState("hungry");
    }
  };
  checkIfSleepy = () => {
    if (this.energy.value <= 6) {
      this.setState("sleepy");
    }
  };
  checkIfEating = () => {
    if (this.hunger.value === 5 || this.hunger.value === 4) {
      this.setState("eating");
    }
  };

  checkIfPlaying = () => {
    if (
      this.energy.value >= 8 &&
      this.hunger.value >= 8 &&
      this.fun.value >= 8 &&
      this.health.value >= 8
    ) {
      this.setState("playing");
    }
  };

  checkIfSleeping = () => {
    if (this.energy.value === 4 || this.energy.value === 5) {
      this.setState("sleeping");
    }
  };

  checkIfDead = () => {
    if (this.health.value <= 0) {
      this.setState("dead");
    }
  };

  // display UI:
  displayStateInUI() {
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
  }

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

  mount = ({ healthElement, hungerElement, energyElement, funElement }) => {
    this.displayHealth(healthElement);
    this.displayHunger(hungerElement);
    this.displayEnergy(energyElement);
    this.displayFun(funElement);
    this.decreaseLifeParams();
    this.checkStateChange();
  };
}
