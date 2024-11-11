import { StageBuilder } from "./StageBuilder";
import { WorldBuilder } from "./WorldBuilder";
import { GameObject } from "./Objects";
import { TankBuilder } from "./TankBuilder";
import { Tank } from "./Tank";
import { Missile } from "./Missile";
import { TankBuilderOptions } from "../interfaces/Interfaces";

export class Stage {
    private ctx: CanvasRenderingContext2D;

    private stageBuilder: StageBuilder;
    private worldBuilder: WorldBuilder;
    private tankBuilder: TankBuilder;
    private tankBuilders: TankBuilderOptions[] = [];

    public missiles: Missile[] = [];
    public tanks: Tank[] = [];
		public enemyTanks: Tank[] = [];
		public stageObjects: GameObject[] = [];
    public frame: number = 0;

    constructor(canvas: HTMLCanvasElement) {
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
            this.stageObjects.push(gameObject);
          });
        });
    }

    giveTanks() {
        const stageOptions  = this.stageBuilder.stage1();
        stageOptions.tankOpts.forEach((tankOpts) => {
            const tank = new Tank(this.ctx, tankOpts, this);
            this.tanks.push(tank);
          });
    }

		checkForStageNewEntries(){
			this.tankBuilders.forEach((builder) => {
				if(!(this.frame % builder.frameInterval) && builder.repetitions > 0){
					console.log('frame for builder: ' + this.frame)
					builder.repetitions-=1;
					const objs = this.tankBuilder[builder.buildMethod](builder.renderMethod);
					objs?.forEach((opts) => {
					  const tank = new Tank(this.ctx, opts, this);
					  this.enemyTanks.push(tank);
					});
				}
			});				
		}

		init(){
			this.giveObjects();
      this.giveTanks();
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