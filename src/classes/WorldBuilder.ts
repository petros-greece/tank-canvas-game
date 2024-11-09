import { BuilderOptions, ObjectOptions } from '../interfaces/Interfaces';

export class WorldBuilder {
  private cW: number;
  private cH: number;

  constructor(canvas: HTMLCanvasElement) {
    this.cW = canvas.width;
    this.cH = canvas.height;
  }

  private giveDefaults(builderOpts: BuilderOptions, objectOpts: ObjectOptions): BuilderOptions {
    return {
      dx: builderOpts.dx !== 0 ? builderOpts.dx + objectOpts.width  : objectOpts.width,
      dy: builderOpts.dy !== 0 ? builderOpts.dy + objectOpts.height : objectOpts.height,
      sx: builderOpts.sx || 0,
      sy: builderOpts.sy || 0,
      sa: builderOpts.sa || 0
    }
  }

  // private giveStartPosition(isHorizontal:boolean, num: number, objectOpts: ObjectOptions): Position {
  //   return isHorizontal ? Math.round( (num*objectOpts.width) % this.cW) + (objectOpts.width/2) : 
  //                         Math.round( (num*objectOpts.height) % this.cH) + (objectOpts.height/2);
  // }

  giveRowOfObjects(builderOpts: BuilderOptions, objectOpts: ObjectOptions): ObjectOptions[] {
    const objects: ObjectOptions[] = [];
    let { dx, dy, sx, sy, sa } = this.giveDefaults(builderOpts, objectOpts);
    
    const isHorizontal = (builderOpts.type === 'horizontal');
    const num =  isHorizontal ? Math.floor(this.cW / objectOpts.width) : Math.floor(this.cH / objectOpts.height);
    //debugger
    const start = isHorizontal ? Math.round( ( this.cW % ( num * objectOpts.width ) ) /2 ) + (objectOpts.width/2) : 
                                 Math.round( ( this.cH % ( num * objectOpts.height ) ) /2 ) + (objectOpts.height/2);
    
   
    let positionX = (objectOpts.position?.x && objectOpts.position?.x !== 0) ? objectOpts.position.x : start;
    let positionY =(objectOpts.position?.y && objectOpts.position?.y !== 0) ? objectOpts.position.y : start;
    let angle = objectOpts.angle ?? 0;
    
    console.log(isHorizontal, start, num);

    for (let i = 0; i < num; i++) {
      console.log(positionX, positionY);
      const obj = this.createObject(i, objectOpts, positionX, positionY, angle);
      objects.push(obj);

      
      const [newPositionX, newPositionY] = this.calculateNewPosition(dx, dy, angle, positionX, positionY);
      isHorizontal ? positionX = newPositionX : positionY = newPositionY;

      [dx, dy] = this.applyScalingFactors(dx, dy, sx, sy);

      [positionX, positionY] = this.adjustPositionWithinBounds(positionX, positionY, dx, dy, objectOpts);

      angle += sa;
    }


    return objects;
  } 


  giveTeamOfObjects(builderOpts: BuilderOptions, objectOpts: ObjectOptions): ObjectOptions[] {
    const objects: ObjectOptions[] = [];
    let { dx, dy, sx, sy, sa } = builderOpts;
    let num = builderOpts.num || 1;


    let positionX = objectOpts.position?.x ?? 0;
    let positionY = objectOpts.position?.y ?? 0;
    let angle = objectOpts.angle ?? 0;
    let inBounds = true;

    for (let i = 0; i < num; i++) {
      const obj = this.createObject(i, objectOpts, positionX, positionY, angle);
      objects.push(obj);

      const [newPositionX, newPositionY] = this.calculateNewPosition(dx, dy, angle, positionX, positionY);
      positionX = newPositionX;
      positionY = newPositionY;

      [dx, dy] = this.applyScalingFactors(dx, dy, sx, sy);

      [positionX, positionY, inBounds] = this.adjustPositionWithinBounds(positionX, positionY, dx, dy, objectOpts);

      angle += sa;
    }

    return objects;
  }

  private createObject(index: number, objectOpts: ObjectOptions, positionX: number, positionY: number, angle: number): ObjectOptions {
    return {
      ...objectOpts,
      id: `${objectOpts.id || 'object'}_${index}`,
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

  private applyScalingFactors(dx: number, dy: number, sx: number, sy: number): [number, number] {
    return [dx + sx, dy + sy];
  }

  private adjustPositionWithinBounds(positionX: number, positionY: number, dx: number, dy: number, objectOpts: ObjectOptions): [number, number, boolean] {
    const halfWidth = objectOpts.width ? objectOpts.width / 2 : 0;
    const halfHeight = objectOpts.height ? objectOpts.height / 2 : 0;
    let gotOfBounds = false;

    if (positionX - halfWidth < 0) {
      gotOfBounds = true;
      positionX = this.cW - halfWidth + (positionX - halfWidth);
      if (dy === 0) positionY += halfHeight * 3;
    } 
    else if (positionX + halfWidth > this.cW) {
      gotOfBounds = true;
      positionX = (positionX + halfWidth - this.cW);
      if (dy === 0) positionY += halfHeight * 3;
    }

    if (positionY - halfHeight < 0) {
      gotOfBounds = true;
      positionY = this.cH - halfHeight + (positionY - halfHeight);
      if (dx === 0) positionX += halfWidth * 3;
    } 
    else if (positionY + halfHeight > this.cH) {
      gotOfBounds = true;
      positionY = (positionY + halfHeight - this.cH);
      if (dx === 0) positionX += halfWidth * 3;
    }

    return [positionX, positionY, gotOfBounds]
  }

}
