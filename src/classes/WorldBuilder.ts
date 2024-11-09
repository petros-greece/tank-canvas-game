import { BuilderOptions, ObjectOptions } from '../interfaces/Interfaces';
  
export class WorldBuilder {
    private cW: number;
    private cH: number;
  
    constructor(canvas: HTMLCanvasElement) {
      this.cW = canvas.width;
      this.cH = canvas.height;
    }
  
    giveTeamOfObjects(builderOpts: BuilderOptions, objectOpts: ObjectOptions = {}): ObjectOptions[] {
      const objects: ObjectOptions[] = [];
      let { num, dx, dy, sx, sy, sa } = builderOpts;
  
      // Use the instance properties for canvas width and height
      const canvasWidth = this.cW;
      const canvasHeight = this.cH;
  
      let positionX = objectOpts.position?.x ?? 0; // Starting position or default to 0
      let positionY = objectOpts.position?.y ?? 0;
      let angle = objectOpts.angle ?? 0;           // Starting angle or default to 0
      const halfWidth = objectOpts.width ? objectOpts.width / 2 : 0;
      const halfHeight = objectOpts.height ? objectOpts.height / 2 : 0;
  
      // Iterate through each object to build and render it
      for (let i = 0; i < num; i++) {
        // Create a copy of the options for this object and apply transformations
        const obj: ObjectOptions = {
          ...objectOpts,
          id: `${objectOpts.id || 'object'}_${i}`, // Unique ID for each object
          position: {
            x: positionX,
            y: positionY
          },
          angle: angle
        };
  
        // Calculate the displacement based on the current angle
        const angleInRadians = angle * (Math.PI / 180);
        const rotatedDx = dx * Math.cos(angleInRadians) - dy * Math.sin(angleInRadians);
        const rotatedDy = dx * Math.sin(angleInRadians) + dy * Math.cos(angleInRadians);
  
        // Update the position incrementally, scaled by sx and sy for each loop
        positionX += rotatedDx;
        positionY += rotatedDy;
  
        // Now apply scaling factors sx and sy after each loop to increment dx and dy
        dx += sx;
        dy += sy;
  
        // Ensure the object stays fully within the bounds, adjusting its position if necessary
        if (positionX - halfWidth < 0) {
          // Move the object to the right side, adding the remainder of its movement
          positionX = canvasWidth - halfWidth + (positionX - halfWidth);
          if (dy === 0) {
            positionY += halfHeight * 3;
          }
        } else if (positionX + halfWidth > canvasWidth) {
          // Move the object to the left side, adding the remainder of its movement
          positionX = 0 + (positionX + halfWidth - canvasWidth);
          if (dy === 0) {
            positionY += halfHeight * 3;
          }
        }
  
        if (positionY - halfHeight < 0) {
          // Move the object to the bottom side, adding the remainder of its movement
          positionY = canvasHeight - halfHeight + (positionY - halfHeight);
          if (dx === 0) {
            positionX += halfWidth * 3;
          }
        } else if (positionY + halfHeight > canvasHeight) {
          // Move the object to the top side, adding the remainder of its movement
          positionY = 0 + (positionY + halfHeight - canvasHeight);
          if (dx === 0) {
            positionX += halfWidth * 3;
          }
        }
  
        // Push the object into the objects array
        objects.push(obj);
  
        // Increment rotation angle by sa for the next object in the loop
        angle += sa;
      }
  
      return objects;
    }
}




  