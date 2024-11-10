import { BuilderOptions, TankOptions } from '../interfaces/Interfaces';

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
    
        // Set the starting position based on the direction specified in builderOpts
        if (builderOpts.dir === 'down') {         
            position.y = this.cH + tankOpts.size * 14; 
        } else if (builderOpts.dir === 'up') {     
            position.y = -(tankOpts.size * 14); 
        } else if (builderOpts.dir === 'left') {
            position.x = -tankOpts.size * 14;; // Start from the left edge
        } else if (builderOpts.dir === 'right') {
            position.x = this.cW + tankOpts.size * 14; // Start from the right edge, taking tank width into account
        } else {
            // Default position if no direction is provided or recognized
            position.x = tankOpts.position?.x?? 0;
            position.y = tankOpts.position?.y?? 0;
        }
    
        return position;
    }
    



    giveTeamOfTanks(builderOpts:BuilderOptions, tankOpts: TankOptions): TankOptions[]{
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


}