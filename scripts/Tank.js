class Tank {

    constructor(ctx, options = {}, game) {
        this.ctx = ctx;
        this.team = options.team || 1;
        this.id = options.id ? `tank_${options.id}` : 'tank_0';
        this.game = game;
    
        // Set up position with default values
        this.position = this.position || {};
        this.position.x = options.position.x || 200;  // Default x position
        this.position.y = options.position.y || 200; // Default y position
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
        this.damage = 0;

        this.selected = false;
        this.stopped = false;
        this.automated = false;
        // Component object for calculations or stored dimensions
        this.comp = {};
        this.init();
    }

    /** PALLETE ******************************************** */

    init() {
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

    render() {

        const size = this.size;
        const ctx = this.ctx;

        // if (this.automated) {
        //     this.render
        // }

        this.renderSelection(ctx);
        this.renderBody(ctx, size);
        this.renderTracks(ctx, size);
        this.renderCannon(ctx, size);

        if (this.isFiring) {
            this.stop();
            this.fireMissileTo(ctx);
        }
        if (this.isExploding) {
            this.renderExplosion();
        }

    }

    renderCannon(ctx, size) {
        ctx.save();
        ctx.rotate((this.cannonAngle) * (Math.PI / 180));
        ctx.fillStyle = this.cannonFill;
        ctx.fillRect(2 * this.size, -0.5 * this.size, 6 * this.size, this.size);
        ctx.restore();
    }

    renderTracks(ctx, size) {
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

    renderBody(ctx, size) {
        // Draw tank body
        ctx.fillStyle = this.bodyFill;
        ctx.fillRect(-this.comp.halfW, -3.5 * size, this.width, this.comp.halfW);

        ctx.fillStyle = `rgba(5,5,5,${this.comp.damage})`;
        ctx.fillRect(-this.comp.halfW, -3.5 * size, this.width * this.comp.damage, this.comp.halfW);

        //console.log(this.comp.damage, this.damage, this.armor);

        // Draw tank tower
        ctx.fillStyle = this.towerFill;
        ctx.beginPath();
        ctx.arc(0, 0, 2 * size, 0, Math.PI * 2);
        ctx.fill();
    }

    renderSelection(ctx) {
        if (this.selected) {
            ctx.fillStyle = this.selectionColor;
            ctx.beginPath();
            ctx.arc(0, 0, this.comp.selectionSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    moveTo() {
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
            this.frame += 1;
        }

        // Move forward or backward if aligned within tolerance of the target direction
        if (Math.abs(angleDifference) <= angleTolerance && distance > this.speed) {
            const moveSpeed = Math.min(this.speed, distance);
            const direction = moveBackward ? -1 : 1;
            this.position.x += Math.cos(this.angle * (Math.PI / 180)) * moveSpeed * direction;
            this.position.y += Math.sin(this.angle * (Math.PI / 180)) * moveSpeed * direction;
            this.frame += 1;
        }

        this.draw();
    };

    draw() {
        // Draw tank with the updated position and angle
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle * (Math.PI / 180));
        this.render();
        ctx.restore();
    }

    /** COLLISIONS ******************************************** */

    collide(obj) {
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

    detectCollision(gameObject) {
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

    collideObject(obj) {
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

    stop() {
        this.moveToPos = JSON.parse(JSON.stringify(this.position));
    }

    /** DAMAGING ***************************************************************** */

    addDamage(power) {
        if (this.comp.damage >= 1) {
            this.explode();
            return;
        }
        this.damage += power;
        this.comp.damage = this.damage / this.armor;

    }

    explode() {
        this.isExploding = true;    // Flag to start the explosion
        this.explosionRadius = 0;   // Start radius for the explosion
        this.explosionMaxRadius = this.width * 2; // Maximum radius of the explosion
        this.explosionFadeOutRadius = this.width; // Radius at which the explosion starts to fade
    };

    // Method to render the explosion effect
    renderExplosion() {
        const ctx = this.ctx;

        // Increase the explosion radius over time
        this.explosionRadius += 2;

        // Create a radial gradient for the explosion effect
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.explosionRadius);

        // Colors for the explosion effect, fading as the radius increases
        gradient.addColorStop(0, "rgba(255, 69, 0, 1)");   // Center bright orange
        gradient.addColorStop(0.5, "rgba(255, 140, 0, 0.8)"); // Outer orange
        gradient.addColorStop(1, "rgba(255, 69, 0, 0)");  // Transparent edge

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.explosionRadius, 0, Math.PI * 2);
        ctx.fill();

        // Restore the context's previous state
        //ctx.restore();

        // End the explosion effect once it exceeds the fade-out radius
        if (this.explosionRadius > this.explosionFadeOutRadius) {
            this.isExploding = false;  // Stop the explosion
            this.explosionRadius = 0;  // Reset the explosion radius
            this.destroy(); // Optional: Handle tank destruction
        }
    };

    destroy() {
        this.isDestroyed = true; // Flag to destroy the tank
    };

    /** FIRING ******************************************** */

    fireMissile(ctx) {
        let cannonGlobalAngle = (this.angle + this.cannonAngle) % 360;
        // Create and initialize the missile
        let missile = new Missile(ctx, {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            angle: cannonGlobalAngle,  // Set missile angle to match the cannon's angle
            width: this.size,
            height: this.size * 4,
            owner: this.id
        });

        // Add the missile to the game's missiles array
        this.game.addMissile(missile);
    }

    fireMissileTo(ctx, missiles) {
        // Calculate the angle to the target position
        const dx = this.targetPos.x - this.position.x;
        const dy = this.targetPos.y - this.position.y;
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI); // Target angle in degrees

        // Account for the tank's rotation by adding the base angle
        let cannonGlobalAngle = (this.angle + this.cannonAngle) % 360;

        // Normalize cannonGlobalAngle and targetAngle to [-180, 180) for consistent comparisons
        if (cannonGlobalAngle > 180) cannonGlobalAngle -= 360;
        if (cannonGlobalAngle < -180) cannonGlobalAngle += 360;

        let normalizedTargetAngle = ((targetAngle % 360) + 360) % 360;
        if (normalizedTargetAngle > 180) normalizedTargetAngle -= 360;

        // Calculate the shortest angle difference
        let angleDifference = normalizedTargetAngle - cannonGlobalAngle;

        // Ensure the shortest path for rotation by adjusting the angle difference
        if (angleDifference > 180) angleDifference -= 360;
        if (angleDifference < -180) angleDifference += 360;

        const rotationStep = 1; // Degrees to rotate per frame

        // Gradually adjust cannon angle to match target direction
        if (Math.abs(angleDifference) > rotationStep) {
            this.cannonAngle += angleDifference > 0 ? rotationStep : -rotationStep;
        } else {
            // Snap the cannon to the target direction once aligned
            this.cannonAngle += angleDifference;
            // Fire missile once aligned with target position
            this.fireMissile(ctx, missiles);
            this.isFiring = false; // Stop firing once aligned with target direction
        }

        // Normalize the cannon angle to keep within [-180, 180)
        this.cannonAngle = ((this.cannonAngle % 360) + 360) % 360;
        if (this.cannonAngle > 180) this.cannonAngle -= 360;
    };


    /** AUTOMATION *********************************************/


    


    /**
     * automate shooting.
     * should draw a line towards the target, check is any obstacles on the way
     * if the is no obstacles, shoot, or else find a way to rich the target when
     * cabaple to shoot at him.
     * 
     * 
     * 
     * 
     */


}
