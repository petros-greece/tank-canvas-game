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


	stage1() {
		const stageOptions: StageOptions = {
			worldBuilders: [
				this.worldbuilder.giveVerticalObjectRow({ width: 50, height: 50 }, { divider: 2 }),
				this.worldbuilder.giveVerticalObjectRow({ width: 50, height: 50 }, {}),
				this.worldbuilder.giveHorizontalObjectRow({ width: 50, height: 50 }, { divider: 2 }),
			],
			tankBuilders: [
				{
					buildMethod: 'giveTeamOfTanks',
					builderOpts: { dir: 'right', num: 3, dy: 155, dx: 1, sa: 10 },
					tankOpts: {
						size: 5,
						position: { x: 0, y: 0 },
						weight: 1000,
						moveMethod: 'findClosestTank',
						isFiring: true,
						reloadSpeed: 70,
						team: 'bad guys'
					},
					frameInterval: 1000,
					repetitions: 3
				},
				{
					buildMethod: 'giveTeamOfTanks',
					builderOpts: { dir: 'down', num: 1, dy: 0, dx: 0, },
					tankOpts: {
						size: 5,
						position: { x: 0, y: 0 },
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
			]

		}

	};



}


