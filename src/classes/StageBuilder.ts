import { BuilderOptions, ObjectOptions, StageOptions, WorldBuilderOptions } from "../interfaces/Interfaces";

export class StageBuilder {
  private cW: number;
  private cH: number;

  constructor(canvas: HTMLCanvasElement) {
    this.cW = canvas.width;
    this.cH = canvas.height;
  }

	private transformTypeToPercentage(builderOpts: BuilderOptions, objectOpts: ObjectOptions, toWidth:boolean) : number {
		if( builderOpts.percent ){
			return builderOpts.percent ? (toWidth ? this.cW : this.cH) / builderOpts.percent : 
			(toWidth ? objectOpts.position?.x : objectOpts.position?.y )?? 0;
		}
		return  (toWidth ? objectOpts.position?.x : objectOpts.position?.y )?? 0;
	}



	giveVerticalObjectRow(objectOpts: ObjectOptions, builderOpts: BuilderOptions) : WorldBuilderOptions {
		let objectOptions = Object.assign({
			height: 50,
			width: 30,
			position: { x: 250, y: 0 },
			weight: 1000,
			isBreakable: true
		}, objectOpts);
		objectOptions.position.x = this.transformTypeToPercentage(builderOpts, objectOptions, true);

		const builderOptions = <BuilderOptions>Object.assign({
			num: 100, dx: -objectOptions.width, dy: 0, type: 'inBounds'
		}, builderOpts)

		return {
			buildMethod: 'giveTeamOfObjects',
			builderOpts: <BuilderOptions>builderOptions,
			objectOpts: objectOptions
		};
	}

	giveHorizontalObjectRow(objectOpts: ObjectOptions) : WorldBuilderOptions {
		const objectOptions = Object.assign({
			height: 50,
			width: 30,
			position: { x: 250, y: 0 },
			weight: 1000,
			isBreakable: true
		}, objectOpts);

		return {
			buildMethod: 'giveTeamOfObjects',
			builderOpts: <BuilderOptions>{ num: 100, dx: 0, dy: -objectOptions.height, type: 'inBounds' },
			objectOpts: objectOptions
		};
	}



}


