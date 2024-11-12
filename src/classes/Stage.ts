import { StageBuilder } from "./StageBuilder";
import { WorldBuilder } from "./WorldBuilder";
import { GameObject } from "./Objects";
import { TankBuilder } from "./TankBuilder";
import { Tank } from "./Tank";
import { Missile } from "./Missile";
import { TankBuilderOptions } from "../interfaces/Interfaces";

export class Stage {
    public ctx: CanvasRenderingContext2D;
    public canvas: HTMLCanvasElement;

    private stageBuilder: StageBuilder;
    private worldBuilder: WorldBuilder;
    private tankBuilder: TankBuilder;
    private tankBuilders: TankBuilderOptions[] = [];
    private currentTankBuilder: number = 0;

    public missiles: Missile[] = [];
    public tanks: Tank[] = [];
		public enemyTanks: Tank[] = [];
		public worldObjects: GameObject[] = [];
    public frame: number = 1;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        this.stageBuilder = new StageBuilder(canvas);
        this.worldBuilder = new WorldBuilder(canvas);
        this.tankBuilder = new TankBuilder(canvas);
    }

    //Ihe equaliry is witho one tank because it wont be destroyed before checking but will be afterwards
    //cause of the game loop
    checkForVictory(myTeam:string) : boolean{
      return this.currentTankBuilder === (this.tankBuilders.length-1) && this.tankBuilders[this.currentTankBuilder].repetitions === 0 &&
            (this.tanks.filter( tank => tank.team !== myTeam )).length === 1;
    }

    giveObjects(){
        const stageOptions  = this.stageBuilder.stage1();
        stageOptions.worldBuilders.forEach((builder) => {
        const objs = this.worldBuilder[builder.buildMethod](builder.builderOpts, builder.objectOpts);
          objs?.forEach((opts) => {
            const gameObject = new GameObject(this.ctx, opts);
            this.worldObjects.push(gameObject);
          });
        });
    }

    giveTanks() {
        const stageOptions  = this.stageBuilder.stage1();
        stageOptions.tankOpts.forEach((tankOpts) => {
            const tank = new Tank(this.canvas, tankOpts, this);
            this.tanks.push(tank);
          });
    }

    giveTankBuilders(){
      const stageOptions  = this.stageBuilder.stage1();
      this.tankBuilders = stageOptions.tankBuilders;
    }

		checkForStageNewEntries(){
      let builder = this.tankBuilders[this.currentTankBuilder];

      console.log('yo',this.currentTankBuilder, (this.tanks.filter( tank => tank.team !== 'Warriors' )).length )
      if( this.currentTankBuilder > 0 && (this.tanks.filter( tank => tank.team !== 'Warriors' )).length === 0 && 
          builder.builderOpts.type === 'sequence' &&  builder.repetitions > 0){
            alert('adding')
            builder.repetitions-=1;
            this.addBuilderTanksToGame(builder);
            if( builder.repetitions === 0 && this.currentTankBuilder < (this.tankBuilders.length - 1) ){
              this.currentTankBuilder+=1;
            }
        return;
      }

      if( (builder.repetitions > 0 ) && !(this.frame % builder.frameInterval) ){
        builder.repetitions-=1;
        this.addBuilderTanksToGame(builder);
        if( builder.repetitions === 0 && this.currentTankBuilder < (this.tankBuilders.length - 1) ){
          this.currentTankBuilder+=1;
        }
      }
							
		}

    private addBuilderTanksToGame(builder: TankBuilderOptions){
      const objs = this.tankBuilder[builder.buildTankMethod](builder.builderOpts, builder.tankOpts);
      objs?.forEach((opts) => {
        const tank = new Tank(this.canvas, opts, this);
        this.tanks.push(tank);
      });
    }

    mpla(){

    }


		init(){
			this.giveObjects();
      this.giveTanks();
      this.giveTankBuilders();
		}





		checkForLoss(){

		}

		run(){

		}

		attachEvents(){

		}








    addMissile(missile: Missile): void {
        this.missiles.push(missile);
    }


}