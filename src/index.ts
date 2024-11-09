import { Game } from './classes/Game';
import { GameOptions } from './interfaces/Interfaces';

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

// Game options object with world builders and tank options
const gameOptions:GameOptions = {
  worldBuilders: [
    {
      buildMethod: 'giveRowOfObjects',
      builderOpts: {
        dx: 0,
        dy: 0,
        sx: 0,
        sy: 0,
        sa: 0,
        type: 'vertical'
      },
      objectOpts: {
        height: 50,
        width: 130,
        position: { x:100, y: 0 },
        weight: 1000,
      }
    }
  ],
  tankOpts: [
    {
      position: { x: 825, y: 75 },
      size: 5,
      speed: 1,
      cannonAngle: 0,
      bodyFill: 'red',
      id: '0',
      team: 'Warriors',
      moveMethod: 'moveTo',
    },
    {
      position: { x: 555, y: 365 },
      size: 8,
      speed: 1,
      cannonAngle: 0,
      bodyFill: 'red',
      id: '1',
      team: 'Warriors',
      moveMethod: 'findClosestTank',
      isFiring: true,
    },
    {
      position: { x: 700, y: 200 },
      bodyFill: "rgba(128, 128, 128, 1)",
      towerFill: "black",
      cannonFill: "black",
      wheelTracksStroke: "rgba(128, 128, 128, 1)",
      wheelTracksFill: "rgba(128, 128, 128, 1)",
      selectionColor: "rgba(128, 128, 128, 0.3)",
      size: 10,
      speed: 0,
      angle: 0,
      cannonAngle: 0,
      team: 'Warriors',
      moveMethod: 'renderStatic',
      weight: 100000000,
      reloadSpeed: 50,
    }
  ]
};

// Initialize the game with the canvas and options
let game = new Game(canvas, gameOptions);
game.attachEvents();

// Start the game loop
game.run();



