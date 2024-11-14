import { Game } from './classes/Game';

// Get the canvas element and its context
const canvas = document.getElementById("tankCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

// Function to resize the canvas based on window size
function resizeCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Call the resize function initially
resizeCanvas(canvas, ctx);

let game = new Game(canvas);
game.attachEvents();
game.run();


