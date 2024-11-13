import { BuilderOptions, ObjectOptions, StageOptions, TankOptions, WorldBuilderOptions, TankBuilderOptions, StageBuilderOptions} from "../interfaces/Interfaces";
import { TankBuilder } from "./TankBuilder";
import { WorldBuilder } from "./WorldBuilder";
import stagesData from "./../json/stages.json" assert { type: "json" };

// Explicitly assert the type afterwards
const stages = stagesData  as unknown as StageBuilderOptions[];

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

		console.log(stages)

	}


	giveMyStageTeam():TankOptions[] {
		return  [{
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
			armor: 1500,					
		}];
	}
	

	// stageConfigs(){
	// 	//stages[0]

	// }


	stage1(): StageOptions {
		let s:StageBuilderOptions = stages[0];
		
		let stageConfig:StageOptions = {
			worldBuilders: [],
			tankBuilders: [],
			tankOpts: this.giveMyStageTeam()	
		} 

		s.worldBuilders.forEach(wb => {
			const worldBuilder:WorldBuilderOptions = this.worldbuilder[wb.method](wb.builderOpts, wb.objectOpts);
			stageConfig.worldBuilders.push(worldBuilder);
		})
		s.tankBuilders.forEach(tb => {
			const tankBuilder:TankBuilderOptions = this.tankBuilder[tb.method](tb.tankType, tb.frameInterval, tb.repetitions, tb.builderOpts);
			stageConfig.tankBuilders.push(tankBuilder);
		})


		return stageConfig;


		// return {
		// 	worldBuilders: [
		// 		this.worldbuilder.giveVerticalObjectRow( { divider: 2, y: this.cH/2, dy: -150 }, { width: 50, height: 50, weight: 100001 } ),
		// 		this.worldbuilder.giveVerticalObjectRow( { divider: 3, y: this.cH/2, dy: 50 }, { width: 50, height: 50 },),			
		// 		//this.worldbuilder.giveVerticalObjectRow( { divider: 3 }, { width: 50, height: 50 },),
		// 		//this.worldbuilder.giveHorizontalObjectRow( { divider: 2 }, { width: 50, height: 50 },),
		// 	],

			// tankBuilders: [
			// 	this.tankBuilder.giveTanksFromTheRight('veryLightTank', 0, 2, {type:'sequence', num: 2 } ),
      //           //this.tankBuilder.giveTanksFromTheRight('veryLightTank', 0, 2, {type:'sequence', num: 3} ),
			// 	// this.tankBuilder.giveTanksFromTheRight('veryLightTank', 1, 2, {type: 'sequence', num: 1} ),
			// 	// this.tankBuilder.giveTanksFromTheRight('veryLightTank', 0, 2, {type: 'sequence', num: 3} ),
			// 	// this.tankBuilder.giveTanksFromTheRight('lightTank', 0, 2, {type: 'sequence'}),
			// 	// this.tankBuilder.giveTanksFromTheRight('mediumTank', 0, 2, {type: 'sequence', y: this.cW/3}),
			// 	// //this.tankBuilder.giveTanksFromTheRight('heavyTank', 6000),

			// ],
			// tankOpts: this.giveMyStageTeam()			
			

		  // }

	};



}


