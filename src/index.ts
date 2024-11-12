import { Game } from './classes/Game';
import { StageBuilder } from './classes/StageBuilder';
import { WorldBuilder } from './classes/WorldBuilder';
import { StageOptions, BuilderOptions } from './interfaces/Interfaces';

// Get the canvas element and its context
const canvas = document.getElementById("tankCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

// Function to resize the canvas based on window size
function resizeCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  //console.log(canvas.width, canvas.height);
  // Optionally scale the drawing context to account for the higher resolution
  //ctx.scale(dpr, dpr);


}

// Call the resize function initially
resizeCanvas(canvas, ctx);








// Initialize the game with the canvas and options
let game = new Game(canvas);
game.attachEvents();

// Start the game loop
game.run();
// setTimeout(() => {

//   alert('yo')
// }, 80)

