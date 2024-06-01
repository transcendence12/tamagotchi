import Tamagotchi from "./modules/tamagotchi.js";

export default class Game {
  constructor() {
    this.tamagotchi = new Tamagotchi();
  }

  start = ({ healthElement, hungerElement, energyElement, funElement }) => {
    this.tamagotchi.mount({ healthElement, hungerElement, energyElement, funElement });
    console.log("Game started");
  };
}
