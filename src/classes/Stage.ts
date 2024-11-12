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
			this.tankBuilders.forEach((builder) => {
				if(!(this.frame % builder.frameInterval) && builder.repetitions > 0){
					console.log('frame for builder: ' + this.frame)
					builder.repetitions-=1;
					const objs = this.tankBuilder[builder.buildTankMethod](builder.builderOpts, builder.tankOpts);
					objs?.forEach((opts) => {
					  const tank = new Tank(this.canvas, opts, this);
					  this.tanks.push(tank);
					});
				}
			});				
		}

		init(){
			this.giveObjects();
      this.giveTanks();
      this.giveTankBuilders();
		}




		checkForVictory(){

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