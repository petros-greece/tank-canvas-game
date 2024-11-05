function Tank(ctx, options = {}) {
    this.ctx = ctx;
    this.team = options.team || 1;
    // Set up position with default values
    this.position = this.position || {};
    this.position.x = options.position.x;  // Default x position
    this.position.y = options.position.y; // Default y position
    this.moveToPos = options.moveToPos || {};
    this.moveToPos.x = options.moveToPos.x;
    this.moveToPos.y = options.moveToPos.y;
    this.targetPos = {};
    // Assign other tank properties with option values or defaults
    this.bodyFill = options.bodyFill ?? "rgba(100,100,100,1)";
    this.towerFill = options.towerFill ?? "rgba(50,50,50,1)";
    this.cannonFill = options.cannonFill ?? "#2b4b29";
    this.wheelTracksStroke = options.wheelTracksStroke ?? "rgb(0,0,0)";
    this.wheelTracksFill = options.wheelTracksFill ?? "rgba(50,50,50,1)";
    this.wheelTracksLineNum = options.wheelTracksLineNum ?? 6;
    this.selectionColor = options.selectionColor ?? "rgba(50,50,50,.3)";

    // Assign defaults for size, speed, angles, and other parameters
    this.size = options.size ?? 10;
    this.speed = options.speed ?? 1;
    this.angle = options.angle ?? 0;
    this.cannonAngle = options.cannonAngle ?? 0;
    this.frame = Math.floor(Math.random() * 10);
    this.weight = 1000;
    this.armor = 100;

    this.selected = false;
    this.stopped = false;
    // Component object for calculations or stored dimensions
    this.comp = {};
    this.init();
}





/** PALLETE ******************************************** */

Tank.prototype.init = function () {
    this.width = 14 * this.size;
    this.height = 11 * this.size;
    this.comp.halfW = 7 * this.size;
    this.comp.halfH = (this.height / 2);
    this.comp.selectionSize = 10 * this.size;
    this.comp.isLockedDir = false;
    this.comp.lineDist = (this.width) / this.wheelTracksLineNum;
    this.comp.halfBody = 3.5 * this.size;
    this.comp.damage = 0;
}

Tank.prototype.render = function () {

    const size = this.size;
    const ctx = this.ctx;

    this.renderSelection(ctx);
    this.renderBody(ctx, size);
    this.renderTracks(ctx, size);
    this.renderCannon(ctx, size);

    if(this.isFiring){
        this.fireMissileTo(ctx);
    }

}

Tank.prototype.renderCannon = function (ctx, size) {
    ctx.save();
    ctx.rotate((this.cannonAngle - this.angle ) * (Math.PI / 180));
    ctx.fillStyle = this.cannonFill;
    ctx.fillRect(2 * this.size, -0.5 * this.size, 6 * this.size, this.size);
    ctx.restore();
}

Tank.prototype.renderTracks = function (ctx, size) {
    // Draw tracks
    ctx.fillStyle = this.wheelTracksFill;
    ctx.fillRect(-this.comp.halfW, -this.comp.halfH, this.width, 2 * size); // Upper track
    ctx.fillRect(-this.comp.halfW, this.comp.halfBody, this.width, 2 * size); // Lower track

    // Draw wheels lines
    ctx.beginPath();
    ctx.strokeStyle = this.wheelTracksStroke;
    const lineDist = this.comp.lineDist;
    const frame = this.frame % lineDist;

    for (let i = 0; i < this.wheelTracksLineNum; i++) {
        ctx.moveTo(-this.comp.halfW + (i * lineDist + frame), -this.comp.halfBody);
        ctx.lineTo(-this.comp.halfW + (i * lineDist + frame), -this.comp.halfH);
        ctx.moveTo(-this.comp.halfW + (i * lineDist + frame), this.comp.halfBody);
        ctx.lineTo(-this.comp.halfW + (i * lineDist + frame), this.comp.halfH);
    }
    ctx.stroke();
}

Tank.prototype.renderBody = function (ctx, size) {
    // Draw tank body
    ctx.fillStyle = this.bodyFill;
    ctx.fillRect(-this.comp.halfW, -3.5 * size, this.width, this.comp.halfW);
    
    ctx.fillStyle = `rgba(5,5,5,${this.comp.damage/this.armor})`;
    ctx.fillRect(-this.comp.halfW, -3.5 * size, this.width, this.comp.halfW);
    //this.comp.damage

    // Draw tank tower
    ctx.fillStyle = this.towerFill;
    ctx.beginPath();
    ctx.arc(0, 0, 2 * size, 0, Math.PI * 2);
    ctx.fill();
}

Tank.prototype.renderSelection = function (ctx) {
    if (this.selected) {
        ctx.fillStyle = this.selectionColor;
        ctx.beginPath();
        ctx.arc(0, 0, this.comp.selectionSize, 0, Math.PI * 2);
        ctx.fill();
    }
}

Tank.prototype.moveTo = function () {
    const dx = this.moveToPos.x - this.position.x;
    const dy = this.moveToPos.y - this.position.y;
    const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI); // Target angle in degrees
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize current tank angle to [0, 360)
    this.angle = (this.angle + 360) % 360;

    // Calculate the angle difference for moving forward
    let forwardAngleDiff = (targetAngle - this.angle + 360) % 360;
    if (forwardAngleDiff > 180) forwardAngleDiff -= 360; // Ensure it's within [-180, 180]

    // Calculate the angle difference for moving backward (180 degrees opposite)
    let backwardAngleDiff = (targetAngle - (this.angle + 180) + 360) % 360;
    if (backwardAngleDiff > 180) backwardAngleDiff -= 360; // Ensure it's within [-180, 180]

    // Determine the optimal movement direction (forward or backward)
    let moveBackward = false;
    let angleDifference = forwardAngleDiff;

    if (Math.abs(backwardAngleDiff) < Math.abs(forwardAngleDiff)) {
        moveBackward = true;
        angleDifference = backwardAngleDiff;
    }

    const rotationSpeed = 1; // Speed of rotation in degrees per frame
    const angleTolerance = 1; // Angle tolerance to stop rotating

    // Rotate gradually toward the target angle if not aligned within tolerance
    if (Math.abs(angleDifference) > angleTolerance) {
        if (angleDifference > 0) {
            this.angle += Math.min(rotationSpeed, angleDifference); // Rotate clockwise
        } else {
            this.angle -= Math.min(rotationSpeed, -angleDifference); // Rotate counterclockwise
        }
        this.angle = (this.angle + 360) % 360; // Keep angle normalized within [0, 360)
    }

    // Move forward or backward if aligned within tolerance of the target direction
    if (Math.abs(angleDifference) <= angleTolerance && distance > this.speed) {
        const moveSpeed = Math.min(this.speed, distance);
        const direction = moveBackward ? -1 : 1;
        this.position.x += Math.cos(this.angle * (Math.PI / 180)) * moveSpeed * direction;
        this.position.y += Math.sin(this.angle * (Math.PI / 180)) * moveSpeed * direction;
    }

    this.draw();
};


Tank.prototype.draw = function () {
    // Draw tank with the updated position and angle
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle * (Math.PI / 180));
    this.render();
    ctx.restore();
}

/** COLLISIONS ******************************************** */

Tank.prototype.collide = function (obj) {
    const dx = this.position.x - obj.position.x;
    const dy = this.position.y - obj.position.y;
    const collisionAngle = Math.atan2(dy, dx);

    this.position.x += Math.cos(collisionAngle) * obj.speed * 2;
    this.position.y += Math.sin(collisionAngle) * obj.speed * 2;

    obj.position.x -= Math.cos(collisionAngle) * this.speed * 2;
    obj.position.y -= Math.sin(collisionAngle) * this.speed * 2;
    //this.moveTo.y  =  this.position.y
    this.draw();

}

Tank.prototype.detectCollision = function(gameObject) {
    // Get rotated corners of tank and gameObject
    const tankCorners = getRotatedCorners(this);
    const objectCorners = getRotatedCorners(gameObject);

    // All edges of both objects, treated as axes to project onto
    const edges = [
        { x: tankCorners[1].x - tankCorners[0].x, y: tankCorners[1].y - tankCorners[0].y },
        { x: tankCorners[1].x - tankCorners[2].x, y: tankCorners[1].y - tankCorners[2].y },
        { x: objectCorners[0].x - objectCorners[1].x, y: objectCorners[0].y - objectCorners[1].y },
        { x: objectCorners[1].x - objectCorners[2].x, y: objectCorners[1].y - objectCorners[2].y }
    ];

    // Check all edges as potential separating axes
    for (const edge of edges) {
        const axis = { x: -edge.y, y: edge.x }; // Perpendicular axis to the edge

        // Project both polygons onto the axis
        const tankProjection = projectPolygon(tankCorners, axis);
        const objectProjection = projectPolygon(objectCorners, axis);

        // If there's no overlap on this axis, there's no collision
        if (!projectionsOverlap(tankProjection.min, tankProjection.max, objectProjection.min, objectProjection.max)) {
            return false; // Separating axis found, no collision
        }
    }

    // No separating axis found, collision detected
    return true;
}; 

Tank.prototype.collideObject = function (obj) {
    const dx = this.position.x - obj.position.x;
    const dy = this.position.y - obj.position.y;
    const collisionAngle = Math.atan2(dy, dx);

    this.position.x += Math.cos(collisionAngle) * this.speed * 2;
    this.position.y += Math.sin(collisionAngle) * this.speed * 2;

    obj.position.x -= Math.cos(collisionAngle) * this.speed * 2;
    obj.position.y -= Math.sin(collisionAngle) * this.speed * 2;
    //this.moveTo.y  =  this.position.y
    this.draw();

}

Tank.prototype.stop = function(){
    this.moveToPos = JSON.parse(JSON.stringify(this.position));
}

/** UI ******************************************** */



Tank.prototype.fireMissile = function (ctx) {
        // Create and initialize the missile
        let missile = new Missile(ctx, {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            angle: this.cannonAngle,  // Set missile angle to match the cannon's angle
            width: this.size,
            height: this.size * 4
        });

        // Add the missile to the game's missiles array
        game.missiles.push(missile);
}

Tank.prototype.fireMissileTo = function (ctx) { 
    this.stop();
    this.isFiring = true;

    // Calculate the angle to the target position
    const dx = this.targetPos.x - this.position.x;
    const dy = this.targetPos.y - this.position.y;
    this.comp.targetAngle = Math.atan2(dy, dx) * (180 / Math.PI); // Convert radians to degrees

    const rotationStep = 1; // Degrees to rotate per frame

    // Calculate angle difference and normalize to [-180, 180] range
    let angleDifference = this.comp.targetAngle - this.cannonAngle;
    angleDifference = normalizeAngleDifference(angleDifference);

    console.log(`Angle Difference: ${angleDifference}`); // Debugging output to verify normalization

    // Rotate the tank's cannon gradually
    if (Math.abs(angleDifference) > rotationStep) {
        // Rotate by one degree in the shortest direction
        this.cannonAngle += (angleDifference > 0 ? rotationStep : -rotationStep);
    } else {
        // Snap to target angle and fire if aligned within tolerance
        this.cannonAngle = this.comp.targetAngle;
        this.isFiring = false;
        this.fireMissile(ctx);
    }
};




Tank.prototype.checkIfClicked = function (position) {
    // Step 1: Translate the click position to the tank's local coordinate system
    const dx = position.x - this.position.x;
    const dy = position.y - this.position.y;

    // Step 2: Rotate the click point in the opposite direction of the tank's rotation
    const angleRad = -this.angle * (Math.PI / 180); // Convert angle to radians
    const rotatedX = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
    const rotatedY = dx * Math.sin(angleRad) + dy * Math.cos(angleRad);

    // Step 3: Check if the rotated click coordinates fall within the tank's rectangular boundaries
    const isWithinBounds = (
        rotatedX >= -this.comp.halfW &&
        rotatedX <= this.comp.halfW &&
        rotatedY >= -this.comp.halfH &&
        rotatedY <= this.comp.halfH
    );
    // Returns true if within bounds, false otherwise
    return isWithinBounds;
};





