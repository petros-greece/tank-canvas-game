import { BuilderOptions, TankOptions, Tank, TankBuilderOptions, RenderTankMethod } from '../interfaces/Interfaces';

export class TankBuilder {
	private cW: number;
	private cH: number;

	constructor(canvas: HTMLCanvasElement) {
		this.cW = canvas.width;
		this.cH = canvas.height;
	}

	private giveBuilderDefaults(builderOpts: BuilderOptions, objectOpts: TankOptions): { 
		dx: number, dy: number, sx: number, sy: number, sa: number } {
		const s = objectOpts?.size ?? 5;
		return {
			dx: builderOpts.dx ? builderOpts.dx + s * 14 : s * 14,
			dy: builderOpts.dy ? builderOpts.dy + s * 11 : s * 11,
			sx: builderOpts.sx || 0,
			sy: builderOpts.sy || 0,
			sa: builderOpts.sa || 0
		}
	}

	private createTank(index: number, objectOpts: TankOptions, positionX: number, positionY: number, angle: number): TankOptions {
		return {
			...objectOpts,
			id: `${objectOpts.id || 'tank'}_${new Date().getTime()}`,
			position: { x: positionX, y: positionY },
			angle: angle
		};
	}

	private calculateNewPosition(dx: number, dy: number, angle: number, positionX: number, positionY: number): [number, number] {
		const angleInRadians = angle * (Math.PI / 180);
		const rotatedDx = dx * Math.cos(angleInRadians) - dy * Math.sin(angleInRadians);
		const rotatedDy = dx * Math.sin(angleInRadians) + dy * Math.cos(angleInRadians);
		return [positionX + rotatedDx, positionY + rotatedDy];
	}

	private applyDisplacementFactor(dx: number, dy: number, sx: number, sy: number): [number, number] {
		return [dx + sx, dy + sy];
	}

	private decideStartPosition(builderOpts: BuilderOptions, tankOpts: TankOptions): { x: number; y: number } {
		let position = { x: 0, y: 0 };

		// Check if x and y positions are defined in tankOpts.position
		const hasX = builderOpts?.x !== undefined && builderOpts.x > -1;
		const hasY = builderOpts?.y !== undefined && builderOpts.y > -1;
		console.log(hasX, hasY)

		// Set the starting position based on the direction specified in builderOpts
		if (builderOpts.dir === 'down') {
			position.y = this.cH + (tankOpts.size || 0) * 14; // Position below canvas
			position.x = hasX ? Number(builderOpts.x) : this.cW / 2 - (tankOpts.size || 0) * 7;
		} else if (builderOpts.dir === 'up') {
			position.y = -(tankOpts.size || 0) * 14; // Position above canvas
			position.x = hasX ? Number(builderOpts.x) : this.cW / 2 - (tankOpts.size || 0) * 7;
		} else if (builderOpts.dir === 'left') {
			position.x = -(tankOpts.size || 0) * 14; // Position to the left of canvas
			position.y = hasY ? Number(builderOpts!.y) : this.cH / 2 - (tankOpts.size || 0) * 7;
		} else if (builderOpts.dir === 'right') {
			position.x = this.cW + (tankOpts.size || 0) * 14; // Position to the right of canvas
			position.y = hasY ? Number(builderOpts!.y) : this.cH / 2 - (tankOpts.size || 0) * 7;
		}

		return position;
	}

	giveTeamOfTanks(builderOpts: BuilderOptions, tankOpts: TankOptions): TankOptions[] {
		const objects: TankOptions[] = [];
		let { dx, dy, sx, sy, sa } = this.giveBuilderDefaults(builderOpts, tankOpts);
		let num = builderOpts.num || 1;

		let { x: positionX, y: positionY } = this.decideStartPosition(builderOpts, tankOpts);
		let angle = tankOpts.angle ?? 0;

		for (let i = 0; i < num; i++) {
			const obj = this.createTank(i, tankOpts, positionX, positionY, angle);
			console.log(positionX, positionY);
			objects.push(obj);

			const [newPositionX, newPositionY] = this.calculateNewPosition(dx, dy, angle, positionX, positionY);
			positionX = newPositionX;
			positionY = newPositionY;

			[dx, dy] = this.applyDisplacementFactor(dx, dy, sx, sy);

			angle += sa;
		}

		return objects;

	}

	giveTanksFromTheRight( renderMethod: RenderTankMethod, frameInterval: number = 1000, repetitions: number = 1, builderOpts?: BuilderOptions, tankOpts?: TankOptions): 
		TankBuilderOptions {

		const tanksNum: number = builderOpts?.num || 2;
		const tankSize: number = tankOpts?.size || 5;
		const dy = (tanksNum !== 1) ?  Math.round( this.cH / (tanksNum -1 )) : this.cH/2
	
		return {
			buildTankMethod: 'giveTeamOfTanks',
			builderOpts: { 
				dir: 'right', 
				y: 0, 
				x: 0,
				dy: dy,
				dx: -tankSize * 14,
				num: tanksNum, 
				sa: 0, 
				...builderOpts
			},
			tankOpts: this[renderMethod]({cannonAngle: 180, ...tankOpts}),
			frameInterval: frameInterval,
			repetitions: repetitions
		}
	}

	/*********************************************************************************** */

	veryLightTank(tankOpts: TankOptions = { size: 4 }): TankOptions {
		return {
			size: 4,
			speed: 2,
			bodyFill: '#f7b264',            // Light orange
			cannonFill: '#b5803d',          // Medium brown
			wheelTracksFill: '#8d5a1c',     // Dark brown
			wheelTracksStroke: '#333',      // Dark gray
			id: 'very_light_tank_' + new Date().getTime(),
			team: 'bad guys',
			moveMethod: 'findClosestTank',
			isFiring: true,
			reloadSpeed: 20,
			armor: 50,
			...tankOpts
		};
	}
	
	lightTank(tankOpts: TankOptions = { size: 5 }): TankOptions {
		return {
			size: 5,
			speed: 1.8,
			bodyFill: '#c9a252',            // Light brownish yellow
			cannonFill: '#5a5e9e',          // Slate blue
			wheelTracksFill: '#45497a',     // Darker slate blue
			wheelTracksStroke: '#222',      // Dark gray
			id: 'light_tank_' + new Date().getTime(),
			team: 'bad guys',
			moveMethod: 'findClosestTank',
			isFiring: true,
			reloadSpeed: 25,
			armor: 75,
			...tankOpts
		};
	}
	
	mediumTank(tankOpts: TankOptions = { size: 6 }): TankOptions {
		return {
			size: 8,
			speed: 1.2,
			bodyFill: '#7f8a5b',            // Olive green
			cannonFill: '#3e2e15',          // Dark brown
			wheelTracksFill: '#2c3052',     // Dark navy
			wheelTracksStroke: '#111',      // Very dark gray
			id: 'medium_tank_' + new Date().getTime(),
			team: 'bad guys',
			moveMethod: 'findClosestTank',
			isFiring: true,
			reloadSpeed: 30,
			armor: 100,
			...tankOpts
		};
	}
	
	heavyTank(tankOpts: TankOptions = { size: 7 }): TankOptions {
		return {
			size: 10,
			speed: 0.8,
			bodyFill: '#4b4b4b',            // Dark gray
			cannonFill: '#2a1e0b',          // Very dark brown
			wheelTracksFill: '#1b1b1b',     // Almost black
			wheelTracksStroke: '#000',      // Black
			id: 'heavy_tank_' + new Date().getTime(),
			team: 'bad guys',
			moveMethod: 'findClosestTank',
			isFiring: true,
			reloadSpeed: 40,
			armor: 140,
			...tankOpts
		};
	}
	





}