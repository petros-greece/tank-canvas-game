import { StageBuilder } from "./StageBuilder";
import { WorldBuilder } from "./WorldBuilder";
import { GameObject } from "./Objects";
import { TankBuilder } from "./TankBuilder";
import { Tank } from "./Tank";
import { Missile } from "./Missile";
import { StageOptions, TankBuilderOptions } from "../interfaces/Interfaces";
import { FabricLayer } from "./FabricLayer";

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

  /** STAGE INTERACTIONS ******************************************************************************** */

  checkForVictory(myTeam: string): boolean {
    return this.currentTankBuilder === (this.tankBuilders.length - 1) && this.tankBuilders[this.currentTankBuilder].repetitions === 0 &&
    (this.tanks.filter(tank => tank.team !== myTeam)).length === 0;
  }

  checkForDefeat(myTeam: string) {
    return (this.tanks.filter(tank => tank.team === myTeam)).length === 0;
  }

  checkForStageNewEntries() {
    let builder = this.tankBuilders[this.currentTankBuilder];
    console.log(!this.areEnemiesOnStage, builder.builderOpts.type === 'sequence', builder.repetitions > 0);
    //check if tanks marked as sequence and if there are no enemies left
    if ( !this.areEnemiesOnStage && builder.builderOpts.type === 'sequence' && builder.repetitions > 0) {
      builder.repetitions -= 1;
      this.addBuilderTanksToGame(builder);
      if (builder.repetitions === 0 && this.currentTankBuilder < (this.tankBuilders.length - 1)) {
        this.currentTankBuilder += 1;
      }
      return;
    }

    //check tanks by frame interval
    if ((builder.repetitions > 0) && !(this.frame % builder.frameInterval)) {
      builder.repetitions -= 1;
      this.addBuilderTanksToGame(builder);
      if (builder.repetitions === 0 && this.currentTankBuilder < (this.tankBuilders.length - 1)) {
        this.currentTankBuilder += 1;
      }
    }

  }

  private get areEnemiesOnStage(): boolean {
    return (this.tanks.filter(tank => tank.team !== 'Warriors')).length !== 0;
  }

  private addBuilderTanksToGame(builder: TankBuilderOptions) {
    const objs = this.tankBuilder[builder.buildTankMethod](builder.builderOpts, builder.tankOpts);
    objs?.forEach((opts) => {
      const tank = new Tank(this.canvas, opts, this);
      this.tanks.push(tank);
    });
  }

  /** INITIALAZATION ******************************************************************************** */

  giveObjects(stageOptions: StageOptions) {
    console.log(stageOptions.worldBuilders)
    stageOptions.worldBuilders.forEach((builder) => {
      const objs = this.worldBuilder[builder.buildMethod](builder.builderOpts, builder.objectOpts);
      objs?.forEach((opts) => {
        const gameObject = new GameObject(this.ctx, opts);
        this.worldObjects.push(gameObject);
      });
    });
  }

  giveTanks(stageOptions: StageOptions) {
    stageOptions.tankOpts.forEach((tankOpts) => {
      const tank = new Tank(this.canvas, tankOpts, this);
      this.tanks.push(tank);
    });
  }

  giveTankBuilders(stageOptions: StageOptions) {
    this.tankBuilders = stageOptions.tankBuilders;
  }

  init() {
    const stageOptions = this.stageBuilder.stage1();
    this.giveObjects(stageOptions);
    this.giveTanks(stageOptions);
    this.giveTankBuilders(stageOptions);

    const l = new FabricLayer('fabricLayer');
    let objs = l.transormAllObjectsToGameObjects(this.ctx);
    this.worldObjects = objs;

  }

  /********************************************************************************** */

  addMissile(missile: Missile): void {
    this.missiles.push(missile);
  }


}