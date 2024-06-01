export default class Tamagotchi {
  constructor() {
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

  decreaseLifeParams = () => {
    this.decrementIntervals.energy = setInterval(this.decreaseEnergy, 2000);
    this.decrementIntervals.hunger = setInterval(this.decreaseHunger, 1000);
    this.decrementIntervals.fun = setInterval(this.decreaseFun, 1000);
    this.decrementIntervals.health = setInterval(this.decreaseHealth, 1000);
  };

  decreaseEnergy = () => {
    if (this.energy.value > 0) {
      this.energy.value--;
      if (this.fun.value <= 0 && this.energy.value > 0) {
        this.energy.value--;
      }
      if (this.energy.value < 0) this.energy.value = 0;
    }
  };

  decreaseHunger = () => {
    if (this.hunger.value > 0) {
      this.hunger.value--;
      if (this.hunger.value < 0) this.hunger.value = 0;
    }
  };

  decreaseFun = () => {
    if (this.fun.value > 0) {
      this.fun.value--;
      if (this.fun.value < 0) this.fun.value = 0;
    }
  };
  
  decreaseHealth = () => {
    if (this.hunger.value <= 0 || this.energy.value <= 0) {
      if (this.health.value > 0) {
        this.health.value--;
        if (this.health.value < 0) this.health.value = 0;
      }
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
  };
}
