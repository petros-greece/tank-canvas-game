import { BuilderOptions, ObjectOptions, StageOptions, WorldBuilderOptions, } from "../interfaces/Interfaces";
import { TankBuilder } from "./TankBuilder";
import { WorldBuilder } from "./WorldBuilder";

export class StageBuilder {
	private cW: number;
	private cH: number;
	private worldbuilder: WorldBuilder;
	private tankBuilder: TankBuilder;

	constructor(canvas: HTMLCanvasElement) {
		this.cW = canvas.width;
		this.cH = canvas.height;
		this.worldbuilder = new WorldBuilder(canvas);
		this.tankBuilder = new TankBuilder(canvas);
	}


	stage1(): StageOptions {
		return {
			worldBuilders: [
				this.worldbuilder.giveVerticalObjectRow( { divider: 2 }, { width: 50, height: 50 },),
				this.worldbuilder.giveVerticalObjectRow( {}, { width: 50, height: 50 },),
				this.worldbuilder.giveHorizontalObjectRow( { divider: 2 }, { width: 50, height: 50 },),
			],
			tankBuilders: [
				this.tankBuilder.giveTanksFromTheRight('veryLightTank'),
			],
			tankOpts: [
				{
					position: { x: 200, y: 365 },
					moveToPos: { x: 200, y: 365 },
					size: 4,
					speed: 1,
					cannonAngle: 0,
					bodyFill: '#fff',
					id: 'test_1',
					team: 'Warriors',
					moveMethod: 'moveTo',
					isFiring: true,
					reloadSpeed: 20,
					armor: 10000,					
				}
			]

		}

	};



}


