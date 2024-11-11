import { Game } from './classes/Game';
import { StageBuilder } from './classes/StageBuilder';
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

let builder = new StageBuilder(canvas);

// Game options object with world builders and tank options
const stageOptions:StageOptions = {
  worldBuilders: [
    // {
    //   buildMethod: 'giveSequenceOfObjects',
    //   builderOpts: {
    //     type: 'horizontal', dx: 40
    //   },
    //   objectOpts: {
    //     height: 50,
    //     width: 30,
    //     position: { x:250, y: 0 },
    //     weight: 1000,
    //     isBreakable: true,
    //     angle: 0,
    //   }
    // },
   builder.giveVerticalObjectRow({width: 50, height: 50, position: { x: 450, y: 5 }}, {percent: 1.1}),
   //should be renamed to divider, also add x,y to builder options
   builder.giveVerticalObjectRow({width: 50, height: 50, position: { x: 475, y: 25 }}, {}),
  // builder.giveHorizontalObjectRow({width: 50, height: 50, position: { x: 0, y: 175 }}),
  ],
  tankBuilders: [
    {
      buildMethod: 'giveTeamOfTanks',
      builderOpts: { dir: 'right', num: 3, dy: 155, dx: 1, sa: 10 },
      objectOpts: {
        size: 5,
        position: { x:0, y: 0 },
        weight: 1000,
        moveMethod: 'findClosestTank',
        isFiring: true,
        reloadSpeed: 70,
        team: 'bad guys'
      },
      frameInterval: 1000,
      repetitions: 3
    },
    // {
    //   buildMethod: 'giveTeamOfTanks',
    //   builderOpts: { dir: 'right', num: 3, dy: 155, dx: 300, },
    //   objectOpts: {
    //     size: 5,
    //     position: { x:250, y: 800 },
    //     weight: 1000,
    //     moveMethod: 'findClosestTank',
    //     isFiring: true,
    //     bodyFill: 'orange',
    //     wheelTracksFill: 'yellow',
    //     reloadSpeed: 70,
    //     team: 'bad guys',
    //     speed: 1.5
    //   },
      
    // },
    // {
    //   buildMethod: 'giveTeamOfTanks',
    //   builderOpts: { dir: 'down', num: 3, dy: 10, dx: 300, },
    //   objectOpts: {
    //     size: 5,
    //     position: { x:990, y: -800 },
    //     weight: 1000,
    //     moveMethod: 'findClosestTank',
    //     isFiring: true,
    //     bodyFill: 'orange',
    //     wheelTracksFill: 'yellow',
    //     reloadSpeed: 70,
    //     team: 'bad guys',
    //     speed: 1.5
    //   },
    //   frameInterval: 20000,
    //   repetitions: 3
    // },
    {
      buildMethod: 'giveTeamOfTanks',
      builderOpts: { dir: 'down', num: 1, dy: 0, dx: 0, },
      objectOpts: {
        size: 5,
        position: { x:0, y: 0 },
        weight: 1000,
        moveMethod: 'findClosestTank',
        isFiring: true,
        bodyFill: 'orange',
        wheelTracksFill: 'yellow',
        reloadSpeed: 70,
        team: 'bad guys',
        speed: 1.5
      },
      frameInterval: 500,
      repetitions: 8
    },
  ],
  tankOpts: [
    // {
    //   position: { x: 825, y: 75 },
    //   size: 5,
    //   speed: 1,
    //   cannonAngle: 0,
    //   bodyFill: 'green',
    //   id: '0',
    //   team: 'Warriors',
    //   moveMethod: 'moveTo',
    // },
    {
      position: { x: 200, y: 365 },
      moveToPos: { x: 200, y: 365 },
      size: 8,
      speed: 1,
      cannonAngle: 0,
      bodyFill: 'red',
      id: 'test_1',
      team: 'Warriors',
      moveMethod: 'moveTo',
      isFiring: true,
      reloadSpeed: 20,
      armor: 10000,
    },
    // {
    //   position: { x: 200, y: 200 },
    //   bodyFill: "rgba(128, 128, 128, 1)",
    //   towerFill: "black",
    //   cannonFill: "black",
    //   wheelTracksStroke: "rgba(128, 128, 128, 1)",
    //   wheelTracksFill: "rgba(128, 128, 128, 1)",
    //   selectionColor: "rgba(128, 128, 128, 0.3)",
    //   size: 10,
    //   speed: 90,
    //   angle: 90,
    //   cannonAngle: 0,
    //   team: 'Warriors',
    //   armor: 100,
    //   moveMethod: 'renderStatic',
    //   weight: 10000000,
    //   reloadSpeed: 20,
    //   isFiring: false,
 
    // }
  ]
};






// Initialize the game with the canvas and options
let game = new Game(canvas, stageOptions);
game.attachEvents();

// Start the game loop
game.run();
// setTimeout(() => {

//   alert('yo')
// }, 80)

