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
				this.worldbuilder.giveVerticalObjectRow( { divider: 2, y: this.cH/2, dy: -150 }, { width: 50, height: 50, weight: 100001 },),
				this.worldbuilder.giveVerticalObjectRow( { divider: 3, y: this.cH/2, dy: 50 }, { width: 50, height: 50 },),			
				//this.worldbuilder.giveVerticalObjectRow( { divider: 3 }, { width: 50, height: 50 },),
				//this.worldbuilder.giveHorizontalObjectRow( { divider: 2 }, { width: 50, height: 50 },),
			],
			tankBuilders: [
				this.tankBuilder.giveTanksFromTheRight('veryLightTank', 300, 4 ),
				this.tankBuilder.giveTanksFromTheRight('lightTank', 0, 4, {type: 'sequence'}),
				//this.tankBuilder.giveTanksFromTheRight('mediumTank', 4000),
				//this.tankBuilder.giveTanksFromTheRight('heavyTank', 6000),

			],
			tankOpts: [
				{
					position: { x: 200, y: this.cH/2 },
					moveToPos: { x: 200, y: 365 },
					size: 8,
					speed: 1,
					cannonAngle: 0,
					bodyFill: '#fff',
					id: 'test_1',
					team: 'Warriors',
					moveMethod: 'moveTo',
					isFiring: true,
					reloadSpeed: 20,
					armor: 5000,					
				}
			]

		}

	};



}


