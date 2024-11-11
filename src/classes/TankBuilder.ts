import { BuilderOptions, TankOptions, Tank, TankBuilderOptions, RenderTankMethod } from '../interfaces/Interfaces';

export class TankBuilder {
	private cW: number;
	private cH: number;

	constructor(canvas: HTMLCanvasElement) {
		this.cW = canvas.width;
		this.cH = canvas.height;
	}

	private giveTankDefaults(builderOpts: BuilderOptions, objectOpts: TankOptions): { dx: number, dy: number, sx: number, sy: number, sa: number } {
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
		const hasX = builderOpts?.x !== undefined && builderOpts.x !== 0;
		const hasY = builderOpts?.y !== undefined && builderOpts.y !== 0;

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
		let { dx, dy, sx, sy, sa } = this.giveTankDefaults(builderOpts, tankOpts);
		let num = builderOpts.num || 1;

		let { x: positionX, y: positionY } = this.decideStartPosition(builderOpts, tankOpts);
		let angle = tankOpts.angle ?? 0;

		for (let i = 0; i < num; i++) {
			const obj = this.createTank(i, tankOpts, positionX, positionY, angle);
			objects.push(obj);

			const [newPositionX, newPositionY] = this.calculateNewPosition(dx, dy, angle, positionX, positionY);
			positionX = newPositionX;
			positionY = newPositionY;

			[dx, dy] = this.applyDisplacementFactor(dx, dy, sx, sy);

			angle += sa;
		}

		return objects;

	}

	giveTanksFromTheRight( renderMethod: RenderTankMethod, frameInterval: number = 1000, repetitions: number = 1, builderOpts?: BuilderOptions, tankOpts?: TankOptions): TankBuilderOptions {
		return {
			buildMethod: 'giveTeamOfTanks',
			builderOpts: { dir: 'right', num: 3, dy: 155, dx: 1, sa: 10, ...builderOpts },
			tankOpts: this[renderMethod](tankOpts),
			frameInterval: frameInterval,
			repetitions: repetitions
		}
	}

	/*********************************************************************************** */


veryLightTank(tankOpts: TankOptions = { size: 5 }): TankOptions {
    return {
        size: 5,
        speed: 2,
        bodyFill: 'yellow',
        cannonFill: '#b8640b',
        wheelTracksFill: 'orange',
        wheelTracksStroke: '#000',
        id: 'light_' + new Date().getTime(),
        team: 'bad guys',
        moveMethod: 'findClosestTank',
        isFiring: true,
        reloadSpeed: 20,
        armor: 5000,
        ...tankOpts
    };
}

lightTank(tankOpts: TankOptions = { size: 6 }): TankOptions {
    return {
        size: 6,
        speed: 1.8,
        bodyFill: 'lightgreen',
        cannonFill: '#7a541b',
        wheelTracksFill: 'green',
        wheelTracksStroke: '#333',
        id: 'light_' + new Date().getTime(),
        team: 'bad guys',
        moveMethod: 'defendBase',
        isFiring: true,
        reloadSpeed: 25,
        armor: 7000,
        ...tankOpts
    };
}

mediumTank(tankOpts: TankOptions = { size: 8 }): TankOptions {
    return {
        size: 8,
        speed: 1.2,
        bodyFill: 'blue',
        cannonFill: '#3a2b0f',
        wheelTracksFill: 'navy',
        wheelTracksStroke: '#111',
        id: 'medium_' + new Date().getTime(),
        team: 'bad guys',
        moveMethod: 'guardArea',
        isFiring: true,
        reloadSpeed: 30,
        armor: 12000,
        ...tankOpts
    };
}

heavyTank(tankOpts: TankOptions = { size: 10 }): TankOptions {
    return {
        size: 10,
        speed: 0.8,
        bodyFill: 'darkgray',
        cannonFill: '#2a1e0b',
        wheelTracksFill: 'black',
        wheelTracksStroke: '#222',
        id: 'heavy_' + new Date().getTime(),
        team: 'bad guys',
        moveMethod: 'holdPosition',
        isFiring: true,
        reloadSpeed: 40,
        armor: 20000,
        ...tankOpts
    };
}




}