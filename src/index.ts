import { Game } from './classes/Game';

import { FabricLayer } from './classes/FabricLayer';



const fabricCanvas = document.getElementById("fabricLayer") as HTMLCanvasElement;
const tankCanvas = document.getElementById("tankCanvas") as HTMLCanvasElement;
const ctx = tankCanvas.getContext("2d") as CanvasRenderingContext2D;

// const l = new FabricLayer('fabricLayer');
// l.addRectangle();

function resizeCanvas() {
  tankCanvas.width = window.innerWidth;
  tankCanvas.height = window.innerHeight;
  fabricCanvas.width = window.innerWidth;
  fabricCanvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


let game = new Game(tankCanvas);
game.attachEvents();
game.run();




