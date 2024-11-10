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
      buildMethod: 'giveSequenceOfObjects',
      builderOpts: {
        type: 'vertical'
      },
      objectOpts: {
        height: 50,
        width: 30,
        position: { x:250, y: 0 },
        weight: 1000,
      }
    }
  ],
  tankBuilders: [
    {
      buildMethod: 'giveTeamOfTanks',
      builderOpts: { dir: 'right', num: 10, dy: 55, dx: 300, },
      objectOpts: {
        size: 5,
        position: { x:250, y: 0 },
        weight: 1000,
        moveMethod: 'findClosestTank',
        isFiring: true,
        reloadSpeed: 70,
        team: 'bad guys'
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
     // moveToPos: { x: 855, y: 65 },
      size: 8,
      speed: 1,
      cannonAngle: 0,
      bodyFill: 'red',
      id: 'test_1',
      team: 'Warriors',
      moveMethod: 'moveTo',
      isFiring: false,
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
      speed: 90,
      angle: 90,
      cannonAngle: 0,
      team: 'Warriors',
      armor: 1000,
      moveMethod: 'renderStatic',
      weight: 10000000,
      reloadSpeed: 20,
      isFiring: false,
 
    }
  ]
};






// Initialize the game with the canvas and options
let game = new Game(canvas, gameOptions);
game.attachEvents();

// Start the game loop
game.run();



