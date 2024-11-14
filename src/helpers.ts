// Utility function for logging
function log(msg: string): void {
    console.log(msg);
  }
  
  // Check if two projections overlap on an axis
  function projectionsOverlap(min1: number, max1: number, min2: number, max2: number): boolean {
    return !(min1 > max2 || min2 > max1);
  }
  
  // Types for Position, Axis, Corners, and GameObject
  interface Position {
    x: number;
    y: number;
  }
  
  interface Axis {
    x: number;
    y: number;
  }
  
  interface Corners extends Position {}
  
  interface GameObject {
    position: Position;
    angle: number;
    comp: any;
  }
  
  // Project a polygon onto an axis and get min and max values
  function projectPolygon(corners: Corners[], axis: Axis): { min: number; max: number } {
    let min = (corners[0].x * axis.x) + (corners[0].y * axis.y);
    let max = min;
  
    for (let i = 1; i < corners.length; i++) {
      const projection = (corners[i].x * axis.x) + (corners[i].y * axis.y);
      if (projection < min) min = projection;
      if (projection > max) max = projection;
    }
  
    return { min, max };
  }
  
  // Get the rotated corners of an object based on its angle and position
  function getRotatedCorners(obj: GameObject): Corners[] {
    const angleRad = obj.angle * (Math.PI / 180); // Convert angle to radians
  
    // Center of the tank
    const cx = obj.position.x;
    const cy = obj.position.y;
  
    // Half dimensions
    const halfW = obj.comp.halfW;
    const halfH = obj.comp.halfH;
  
    // Calculate the corners with rotation
    return [
      {
        x: cx + (Math.cos(angleRad) * -halfW - Math.sin(angleRad) * -halfH),
        y: cy + (Math.sin(angleRad) * -halfW + Math.cos(angleRad) * -halfH),
      },
      {
        x: cx + (Math.cos(angleRad) * halfW - Math.sin(angleRad) * -halfH),
        y: cy + (Math.sin(angleRad) * halfW + Math.cos(angleRad) * -halfH),
      },
      {
        x: cx + (Math.cos(angleRad) * halfW - Math.sin(angleRad) * halfH),
        y: cy + (Math.sin(angleRad) * halfW + Math.cos(angleRad) * halfH),
      },
      {
        x: cx + (Math.cos(angleRad) * -halfW - Math.sin(angleRad) * halfH),
        y: cy + (Math.sin(angleRad) * -halfW + Math.cos(angleRad) * halfH),
      },
    ];
  }
  
  // Normalize angle difference to a range of [-180, 180]
  function normalizeAngleDifference(angleDifference: number): number {
    angleDifference = (angleDifference + 360) % 360; // Bring within [0, 360]
    if (angleDifference > 180) angleDifference -= 360; // Adjust to [-180, 180]
    return angleDifference;
  }
  
  // Check if a point (click position) is within the bounds of a rectangular object
  export function checkIfClicked(position: Position, body: any): boolean {
    // Step 1: Translate the click position to the tank's local coordinate system
    const dx = position.x - body.position.x;
    const dy = position.y - body.position.y;
  
    // Step 2: Rotate the click point in the opposite direction of the tank's rotation
    const angleRad = -body.angle * (Math.PI / 180); // Convert angle to radians
    const rotatedX = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
    const rotatedY = dx * Math.sin(angleRad) + dy * Math.cos(angleRad);
  
    // Step 3: Check if the rotated click coordinates fall within the tank's rectangular boundaries
    const isWithinBounds = (
      rotatedX >= -body.comp.halfW &&
      rotatedX <= body.comp.halfW &&
      rotatedY >= -body.comp.halfH &&
      rotatedY <= body.comp.halfH
    );
  
    return isWithinBounds;
  }
  
  // Detect if two game objects collide
  export function detectCollision(gameObject: any, otherGameObject: any): boolean {
    const otherCorners = getRotatedCorners(otherGameObject);
    const objectCorners = getRotatedCorners(gameObject);
  
    const edges = [
      { x: otherCorners[1].x - otherCorners[0].x, y: otherCorners[1].y - otherCorners[0].y },
      { x: otherCorners[1].x - otherCorners[2].x, y: otherCorners[1].y - otherCorners[2].y },
      { x: objectCorners[0].x - objectCorners[1].x, y: objectCorners[0].y - objectCorners[1].y },
      { x: objectCorners[1].x - objectCorners[2].x, y: objectCorners[1].y - objectCorners[2].y }
    ];
  
    for (const edge of edges) {
      const axis = { x: -edge.y, y: edge.x };
  
      const otherProjection = projectPolygon(otherCorners, axis);
      const objectProjection = projectPolygon(objectCorners, axis);
  
      if (!projectionsOverlap(otherProjection.min, otherProjection.max, objectProjection.min, objectProjection.max)) {
        return false;
      }
    }
  
    return true;
  }
  
  // Get the closest object to a reference object
  function getClosestObject(this: GameObject, objects: GameObject[]): GameObject | null {
    let closestObject: GameObject | null = null;
    let minDistance = Infinity;
  
    objects.forEach((obj) => {
      if (obj !== this) {
        const dx = obj.position.x - this.position.x;
        const dy = obj.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < minDistance) {
          minDistance = distance;
          closestObject = obj;
        }
      }
    });
  
    return closestObject;
  }

  export function calculateAngle(point1: Position, point2: Position) {
    const dx = point2.x - point1.x; // Difference in x
    const dy = point2.y - point1.y; // Difference in y
    const angleRadians = Math.atan2(dy, dx); // Angle in radians
    const angleDegrees = angleRadians * (180 / Math.PI); // Convert to degrees if needed
    return angleDegrees; // Return angle in degrees
  }

  