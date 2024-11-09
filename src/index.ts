import { Game } from './classes/Game';

// Get the canvas element and its context
const canvas = document.getElementById("tankCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

// Function to resize the canvas based on window size
function resizeCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  console.log(canvas.width, canvas.height);
  // Optionally scale the drawing context to account for the higher resolution
  //ctx.scale(dpr, dpr);
}

// Call the resize function initially
resizeCanvas(canvas, ctx);

// Game options object with world builders and tank options
const gameOptions = {
  worldBuilders: [
    {
      builderOpts: {
        num: 16,
        dx: 60,
        dy: 43,
        sx: 1,
        sy: 0,
        sa: 2,
      },
      objectOpts: {
        height: 50,
        width: 20,
        position: { x: 40, y: 20 },
        weight: 1000,
      }
    }
  ],
  tankOpts: [
    {
      position: { x: 25, y: 75 },
      wheelLineNum: 2,
      size: 5,
      speed: 1,
      frame: 0,
      cannonAngle: 0,
      bodyFill: 'red',
      id: 0,
      team: 'Warriors',
      move: 'moveTo',
    },
    {
      position: { x: 255, y: 365 },
      wheelLineNum: 2,
      size: 8,
      speed: 1,
      frame: 0,
      cannonAngle: 0,
      bodyFill: 'red',
      id: 1,
      team: 'Warriors',
      move: 'findClosestTank',
      isFiring: true,
    },
    {
      position: { x: 200, y: 200 },
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
      move: 'renderStatic',
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



