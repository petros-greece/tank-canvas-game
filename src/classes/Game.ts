import { Tank } from "./Tank";
import { Missile } from "./Missile";
import { GameObject } from "./Objects";
import { WorldBuilder } from "./WorldBuilder";
import { TankOptions, GameOptions, ObjectOptions, BuilderOptions } from "../interfaces/Interfaces";
import { detectCollision, checkIfClicked }  from "../helpers";



export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  team: string;
  frame: number;
  tanks: Tank[];
  missiles: Missile[];
  objects: GameObject[];
  stage: number;
  score: number;
  time: number;
  stats: {
    kills: number;
    hits: number;
    shotsFired: number;
    accuracy: number;
  };
  settings: {
    difficulty: string;
    maxMissiles: number;
    maxTanks: number;
    stageBackground: string;
  };
  builder: WorldBuilder;
  worldBuilders:  {builderOpts:BuilderOptions, buildMethod:keyof WorldBuilder, objectOpts: ObjectOptions}[]; // Specify a more precise type if possible
  worldObjects: GameObject[];
  tankOpts: TankOptions[]; // Specify a more precise type if possible
  interval: any;

  constructor(canvas: HTMLCanvasElement, options: GameOptions = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.team = "Warriors";
    this.frame = 0;
    this.tanks = [];
    this.missiles = [];
    this.objects = [];
    this.stage = options.stage || 1;
    this.score = options.score || 0;
    this.time = options.time || 0;
    this.stats = options.stats || {
      kills: 0,
      hits: 0,
      shotsFired: 0,
      accuracy: 0,
    };
    this.settings = options.settings || {
      difficulty: "normal",
      maxMissiles: 10,
      maxTanks: 5,
      stageBackground: "#333",
    };
    this.builder = new WorldBuilder(canvas);
    this.worldBuilders = options.worldBuilders || [];
    this.worldObjects = [];
    this.tankOpts = options.tankOpts || [];
    this.interval = null;

    this.init(canvas);
  }

  init(canvas: HTMLCanvasElement): void {
    const ctx = this.ctx;

    this.worldBuilders.forEach((builder) => {
      const objs = this.builder[builder.buildMethod](builder.builderOpts, builder.objectOpts);
      objs.forEach((opts) => {
        const gameObject = new GameObject(ctx, opts);
        this.worldObjects.push(gameObject);
      });
    });

    this.tankOpts.forEach((tankOpts) => {
      const tank = new Tank(ctx, tankOpts, this);
      this.tanks.push(tank);
    });
  }

  run(): void {
    
    const ctx = this.ctx;
    const cW = this.canvas.width;
    const cH = this.canvas.height;

    setInterval(() => {
      ctx.clearRect(0, 0, cW, cH);
     
      //console.log(this);
      this.tanks.forEach((tank, index) => {
        if (tank.isDestroyed) {
          this.tanks.splice(index, 1);
        }

        this.missiles.forEach((missile, missileIndex) => {
          if (!tank.isExploding && missile.owner !== tank.id && detectCollision(missile, tank) && !missile.isExploding) {
            missile.isExploding = true;
            tank.addDamage(10);
          }
        });

        this.tanks.forEach((otherTank, otherTankIndex) => {
          
          if (otherTankIndex !== index && detectCollision(otherTank, tank)) {
            console.log('collides')
            tank.collide(otherTank);
            otherTank.collide(tank);
            tank.moveToPos = tank.position;
          }
        });

        tank.move();
      });

      this.worldObjects.forEach((obj) => {
        this.tanks.forEach((tank) => {
          if (detectCollision(tank, obj)) {
            tank.collide(obj);
          }
        });

        this.missiles.forEach((missile) => {
          if (missile.owner !== obj.id && detectCollision(missile, obj) && !missile.isExploding) {
            missile.isExploding = true;
            obj.getHit(missile);
          }
        });

        this.worldObjects.forEach((otherObj) => {
          if (detectCollision(otherObj, obj)) {
            obj.collide(otherObj);
          }
        });

        obj.render();
      });

      this.missiles.forEach((missile, index) => {
        if (missile.hasExploded) {
          this.missiles.splice(index, 1);
        }
        missile.render();
      });

      this.frame += 1;
    }, 10);
  }

  attachEvents(): void {
    let selectedTankIndex = -1;

    this.canvas.addEventListener("click", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const position = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      const tanks = this.tanks;
      let isEntityClicked = false;

      tanks.forEach((tank, index) => {
        tank.isSelected = false;

        if (checkIfClicked(position, tank)) {
          isEntityClicked = true;
          if (tank.team === this.team) {
            selectedTankIndex = index;
          } else {
            tanks[selectedTankIndex].target = tank;
            tanks[selectedTankIndex].isFiring = true;
            tanks[selectedTankIndex].stop();
          }
        }
      });

      this.worldObjects.forEach((obj) => {
        if (checkIfClicked(position, obj)) {
          isEntityClicked = true;
          tanks[selectedTankIndex].stop();
          tanks[selectedTankIndex].target = obj;
          tanks[selectedTankIndex].isFiring = true;
        }
      });

      if (!isEntityClicked && selectedTankIndex !== -1) {
        tanks[selectedTankIndex].isFiring = false;
        tanks[selectedTankIndex].target = null;
        tanks[selectedTankIndex].moveToPos = position;
        tanks[selectedTankIndex].go();
      }

      if (selectedTankIndex !== -1) {
        tanks[selectedTankIndex].isSelected = true;
      }
    });
  }

  addMissile(missile: Missile): void {
    this.missiles.push(missile);
  }
}


