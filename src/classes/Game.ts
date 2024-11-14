import { Tank } from "./Tank";
import { Missile } from "./Missile";
import { GameObject } from "./Objects";
import { WorldBuilder } from "./WorldBuilder";
import { TankBuilder } from "./TankBuilder";
import { TankOptions, StageOptions, ObjectOptions, BuilderOptions, PublicMethodNames, TankBuilderOptions, WorldBuilderOptions } from "../interfaces/Interfaces";
import { detectCollision, checkIfClicked }  from "../helpers";
import { Stage } from "./Stage";

export class Game extends Stage {

  team: string;


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
  selectedTank: Tank | null;
  interval: any;

  constructor(canvas: HTMLCanvasElement, options: any = {}) {
    super(canvas);


    this.team = "Warriors";
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

    this.selectedTank= null;
    this.interval = null;

    this.init();
  }


  run(): void {
    
    const ctx = this.ctx;
    const cW = this.canvas.width;
    const cH = this.canvas.height;
    //this.checkForStageNewEntries();
    
    this.interval = setInterval(() => {
      ctx.clearRect(0, 0, cW, cH);
      this.frame += 1;
      if( !(this.frame%100) ){
        //console.log('Checking for entries');
        this.checkForStageNewEntries();
      }
     
      //console.log(this);
      this.tanks.forEach((tank, index) => {
        if (tank.isDestroyed) {
          this.tanks.splice(index, 1);
          if( this.checkForVictory(this.team) ){
            alert('You re the greatest');
          }
          else if( this.checkForDefeat(this.team) ) {
            alert('You re the worst');
          }
        }

        this.missiles.forEach((missile, missileIndex) => {
          if (!tank.isExploding && missile.owner !== tank.team && detectCollision(missile, tank) && !missile.isExploding) {
            missile.isExploding = true;
            tank.addDamage(missile.force);
            if(tank.comp.damage >=1 ){
             
            }
          }
        });

        this.tanks.forEach((otherTank, otherTankIndex) => {
          
          if (otherTankIndex !== index && detectCollision(otherTank, tank)) {
            //console.log('collides')
            tank.collide(otherTank);
            tank.moveToPos = tank.position;
          }
        });

        tank.move();
      });



      this.worldObjects.forEach((obj, index) => {

        if (obj.isDestroyed) {
          this.worldObjects.splice(index, 1);
        }

        this.tanks.forEach((tank) => {
          if (detectCollision(tank, obj)) {
            tank.collide(obj);
          }
        });

        this.missiles.forEach((missile) => {
          if (missile.owner !== obj.team && detectCollision(missile, obj) && !missile.isExploding) {
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

    }, 10);
  }

  attachEvents(): void {
    //this.selectedTankIndex = -1;

    this.canvas.addEventListener("click", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const position = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      const tanks = this.tanks;
      let isEntityClicked = false;

      tanks.forEach((tank, index) => {
        //tank.isSelected = false;

        if (checkIfClicked(position, tank)) {
          console.log('tank clicked', tank);
          isEntityClicked = true;
          if (tank.team === this.team) {
            console.log('my team');
            this.selectedTank = tank;
          } 
          else if(this.selectedTank){
            console.log('other team', tank);
            this.selectedTank.target = tank;
            this.selectedTank.isFiring = true;
            //this.selectedTank.stop();
          }
        }
      });

      this.worldObjects.forEach((obj) => {
        if (checkIfClicked(position, obj) && this.selectedTank) {
          isEntityClicked = true;
          this.selectedTank.stop();
          this.selectedTank.target = obj;
          this.selectedTank.isFiring = true;
        }
      });

      if (!isEntityClicked && this.selectedTank ) {
        console.log('selected start moving', this.selectedTank );

        this.selectedTank.isFiring = false;
        this.selectedTank.target = null;
        this.selectedTank.moveToPos = position;
        this.selectedTank.go();
      }

      if (this.selectedTank) {
        console.log('clicked on selected selected!!!', this.selectedTank);

        this.selectedTank.isSelected = true;
      }
    });
  }

  addMissile(missile: Missile): void {
    this.missiles.push(missile);
  }


}


