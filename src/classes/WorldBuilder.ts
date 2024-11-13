import { BuilderOptions, ObjectOptions, Position, WorldBuilderOptions } from '../interfaces/Interfaces';

export class WorldBuilder {
  private cW: number;
  private cH: number;

  constructor(canvas: HTMLCanvasElement) {
    this.cW = canvas.width;
    this.cH = canvas.height;
  }


  private giveObjectDefaults(builderOpts: BuilderOptions, objectOpts: ObjectOptions): { dx: number, dy: number, sx: number, sy: number, sa: number } {
    return {
      dx: builderOpts.dx ? builderOpts.dx + objectOpts.width : objectOpts.width,
      dy: builderOpts.dy ? builderOpts.dy + objectOpts.height : objectOpts.height,
      sx: builderOpts.sx || 0,
      sy: builderOpts.sy || 0,
      sa: builderOpts.sa || 0
    }
  }

  protected giveSequenceOfObjects(builderOpts: BuilderOptions, objectOpts: ObjectOptions): ObjectOptions[] {
    const objects: ObjectOptions[] = [];

    let { dx, dy, sx, sy, sa } = this.giveObjectDefaults(builderOpts, objectOpts);
    const isHorizontal = builderOpts.type === 'horizontal';
    const num = this.calculateObjectCountToFillAxis(isHorizontal, objectOpts, builderOpts);
    const start = this.determineAxisStartPosition(isHorizontal, num, objectOpts);

    let { positionX, positionY, angle } = this.initializePositionAndAngle(start, objectOpts);

    for (let i = 0; i < num; i++) {
      const obj = this.createObject(i, objectOpts, positionX, positionY, angle);
      objects.push(obj);

      const [newPositionX, newPositionY] = this.calculateNewPosition(dx, dy, angle, positionX, positionY);
      isHorizontal ? positionX = newPositionX : positionY = newPositionY;

      [dx, dy] = this.applyDisplacementFactor(dx, dy, sx, sy);
      [positionX, positionY] = this.adjustPositionWithinBounds(positionX, positionY, dx, dy, objectOpts);

      angle += sa;
    }

    return objects;
  }

  private calculateObjectCountToFillAxis(isHorizontal: boolean, objectOpts: ObjectOptions, builderOpts: BuilderOptions): number {
    return isHorizontal ? Math.floor(this.cW / (objectOpts.width + (builderOpts.dx ?? 0))) :
      Math.floor(this.cH / (objectOpts.height + (builderOpts.dx ?? 0)));
  }

  private determineAxisStartPosition(isHorizontal: boolean, num: number, objectOpts: ObjectOptions): number {
    return isHorizontal
      ? Math.round((this.cW % (num * objectOpts.width)) / 2) + objectOpts.width / 2
      : Math.round((this.cH % (num * objectOpts.height)) / 2) + objectOpts.height / 2;
  }

  private initializePositionAndAngle(start: number, objectOpts: ObjectOptions): { positionX: number; positionY: number; angle: number } {
    const positionX = objectOpts.position?.x && objectOpts.position.x !== 0 ? objectOpts.position.x : start;
    const positionY = objectOpts.position?.y && objectOpts.position.y !== 0 ? objectOpts.position.y : start;
    const angle = objectOpts.angle ?? 0;
    return { positionX, positionY, angle };
  }

  /*********************************************************************** */

  protected giveTeamOfObjects(builderOpts: BuilderOptions, objectOpts: ObjectOptions): ObjectOptions[] {
    const objects: ObjectOptions[] = [];
    let { dx, dy, sx, sy, sa } = this.giveObjectDefaults(builderOpts, objectOpts);
    let num = builderOpts.num || 1;


    let positionX = builderOpts?.x ?? objectOpts.width / 2;
    let positionY = builderOpts?.y ?? objectOpts.height / 2;
    let angle = objectOpts.angle ?? 0;
    let outOfBounds = true;

    for (let i = 0; i < num; i++) {
      const obj = this.createObject(i, objectOpts, positionX, positionY, angle);
      objects.push(obj);

      const [newPositionX, newPositionY] = this.calculateNewPosition(dx, dy, angle, positionX, positionY);
      positionX = newPositionX;
      positionY = newPositionY;

      [dx, dy] = this.applyDisplacementFactor(dx, dy, sx, sy);

      [positionX, positionY, outOfBounds] = this.adjustPositionWithinBounds(positionX, positionY, dx, dy, objectOpts);

      if (outOfBounds && builderOpts?.type === 'inBounds') {
        break;
      }
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
    return [positionX + dx, positionY + dy];
  }

  private applyDisplacementFactor(dx: number, dy: number, sx: number, sy: number): [number, number] {
    return [dx + sx, dy + sy];
  }

  private giveHalfObject(objectOpts: { size?: number; width?: number; height?: number } = {}): { halfWidth: number, halfHeight: number } {
    return {
      halfWidth: (objectOpts.width ?? 0) / 2,
      halfHeight: (objectOpts.height ?? 0) / 2
    };
  }

  private adjustPositionWithinBounds(positionX: number, positionY: number, dx: number, dy: number, objectOpts: ObjectOptions): [number, number, boolean] {
    const { halfWidth, halfHeight } = this.giveHalfObject(objectOpts);
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

  /******************************************************************************************************************************************/


  private transformTypeToPercentage(builderOpts: BuilderOptions, objectOpts: ObjectOptions): Position {
    return {
      x: builderOpts.dividerX ? this.cW - (this.cW / builderOpts.dividerX)  : objectOpts.width / 2,
      y: builderOpts.dividerY ? this.cH - (this.cH / builderOpts.dividerY) : objectOpts.height / 2,
    }
  }

  giveVerticalObjectRow(builderOpts: BuilderOptions, objectOpts: ObjectOptions,): WorldBuilderOptions {
    const method = builderOpts.materialType ? builderOpts.materialType : 'smLight'
    const objectOptions = Object.assign(this[method], objectOpts);
    const startPos = this.transformTypeToPercentage(builderOpts, objectOptions);
    builderOpts.x = startPos.x;
    builderOpts.y = startPos.y;

    const builderOptions = <BuilderOptions>Object.assign({
      num: 100, dx: -objectOptions.width, dy: 1, type: 'inBounds'
    }, builderOpts)

    return {
      buildMethod: 'giveTeamOfObjects',
      builderOpts: <BuilderOptions>builderOptions,
      objectOpts: objectOptions
    };
  }

  giveHorizontalObjectRow(builderOpts: BuilderOptions, objectOpts: ObjectOptions): WorldBuilderOptions {

    const method = builderOpts.materialType ? builderOpts.materialType : 'smLight'
    const objectOptions = Object.assign(this[method], objectOpts);
    const startPos = this.transformTypeToPercentage(builderOpts, objectOptions);
    builderOpts.x = startPos.x;
    builderOpts.y = startPos.y;

    const builderOptions = <BuilderOptions>Object.assign({
      num: 100, dy: -objectOptions.height, dx: 0, type: 'inBounds'
    }, builderOpts)
    return {
      buildMethod: 'giveTeamOfObjects',
      builderOpts: <BuilderOptions>builderOptions,
      objectOpts: objectOptions
    };
  }

  /************************************************************************************************************************************
   * 
   */


  private get smLight(): ObjectOptions {
    return {
      height: this.cW / 40,
      width: this.cW / 40,
      weight: 250,
      isBreakable: true,
      color: '#25f57b'
    }
  }

  private get smMedium(): ObjectOptions {
    return {
      height: this.cW / 40,
      width: this.cW / 40,
      weight: 500,
      isBreakable: true,
      color: '#25f57b'
    }
  }

  private get smHeavy(): ObjectOptions {
    return {
      height: this.cW / 40,
      width: this.cW / 40,
      weight: 1000,
      isBreakable: false,
      color: '#25f57b'
    }
  }

  private get mdLight(): ObjectOptions {
    return {
      height: this.cW / 30,
      width: this.cW / 30,
      weight: 500,
      isBreakable: true,
      color: '#4bcf83'
    }
  }

  private get mdMedium(): ObjectOptions {
    return {
      height: this.cW / 30,
      width: this.cW / 30,
      weight: 1000,
      isBreakable: true,
      color: '#4bcf83'
    }
  }

  private get mdHeavy(): ObjectOptions {
    return {
      height: this.cW / 30,
      width: this.cW / 30,
      weight: 2000,
      isBreakable: false,
      color: '#4bcf83'
    }
  }

  private get lgLight(): ObjectOptions {
    return {
      height: this.cW / 20,
      width: this.cW / 20,
      weight: 1000,
      isBreakable: true,
      color: '#18a558'
    }
  }

  private get lgMedium(): ObjectOptions {
    return {
      height: this.cW / 20,
      width: this.cW / 20,
      weight: 2000,
      isBreakable: false,
      color: '#18a558'
    }
  }

  private get lgHeavy(): ObjectOptions {
    return {
      height: this.cW / 20,
      width: this.cW / 20,
      weight: 4000,
      isBreakable: false,
      color: '#18a558'
    }
  }


}
