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
        this.moveToPos = options.moveToPos || { ...this.position };
        this.target = {};
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
        this.isFiring = options.isFiring?? false;
        this.weight = options.weight || 1000;
        this.reloadSpeed = 100;

        this.armor = 100;
        this.damage = 0;

        this.isSelected = false;
        this.isColliding = false;
        this.isStopped = false;
        this.canShoot = true;

        // Component object for calculations or stored dimensions
        this.comp = {};
        this.move = options.move ? this[options.move] : this.moveTo;
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

        const ctx = this.ctx;

        this.draw();

        if (this.isFiring) {
            this.fireMissileTo(ctx);
        }
        if (this.isExploding) {
            this.renderExplosion();
        }

    }

    renderStatic() {

        const ctx = this.ctx;

        this.drawStatic();

        if (this.isFiring) {
            this.fireMissileTo(ctx);
        }
        if (this.isExploding) {
            this.renderExplosion();
        }

    }


    draw() {
        const size = this.size;
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle * (Math.PI / 180));
        this.drawSelection(ctx);
        this.drawBody(ctx, size);
        this.drawTracks(ctx, size);
        this.drawTower(ctx, size);
        this.drawCannon(ctx, size);
        ctx.restore();
    }

    drawStatic() {
        const size = this.size;
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle * (Math.PI / 180));
        this.drawSelection(ctx);
        this.drawBodyStatic(ctx);
        this.drawTower(ctx, size);
        this.drawCannon(ctx, size);
        ctx.restore();
    }


    drawCannon(ctx, size) {
        ctx.save();
        ctx.rotate((this.cannonAngle) * (Math.PI / 180));
        ctx.fillStyle = this.cannonFill;
        ctx.fillRect(2 * size, -0.5 * size, 6 * size, size);
        ctx.restore();
    }

    drawTracks(ctx, size) {
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

    drawBody(ctx, size) {
        // Draw tank body
        ctx.fillStyle = this.bodyFill;
        ctx.fillRect(-this.comp.halfW, -3.5 * size, this.width, this.comp.halfW);

        ctx.fillStyle = `rgba(5,5,5,${this.comp.damage})`;
        ctx.fillRect(-this.comp.halfW, -3.5 * size, this.width * this.comp.damage, this.comp.halfW);

    }

    drawBodyStatic(ctx, size) {
        // Draw tank body
        ctx.fillStyle = this.bodyFill;
        ctx.fillRect(-this.comp.halfW, -this.comp.halfH, this.width, 2*this.comp.halfH);

        ctx.fillStyle = `rgba(5,5,5,${this.comp.damage})`;
        ctx.fillRect(-this.comp.halfW, -this.comp.halfH, this.width, 2*this.comp.halfH);
    }

    drawTower(ctx, size) {
        // Draw tank tower
        ctx.fillStyle = this.towerFill;
        ctx.beginPath();
        ctx.arc(0, 0, 2 * size, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSelection(ctx) {
        if (this.isSelected) {
            ctx.fillStyle = this.selectionColor;
            ctx.beginPath();
            ctx.arc(0, 0, this.comp.selectionSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    /** MOVEMENT ******************************************** */

    moveTo() {
        if (this.isFiring || this.isStopped) {
            this.render();
            return;
        }
   
        this.moveOrRotateCannon();
        this.render();   
    }

    moveOrRotateCannon() {
        const { dx, dy, distance, targetAngle } = this.calculateTargetPosition();

        const { moveBackward, angleDifference } = this.calculateMovementDirection(targetAngle);

        if (this.needsRotation(angleDifference)) {
            this.rotateTowardsTarget(angleDifference);
        } else if (distance > this.speed) {
            this.moveInDirection(distance, moveBackward);
        }
    }

    // Calculate the target position's dx, dy, distance, and angle
    calculateTargetPosition() {
        const dx = this.moveToPos.x - this.position.x;
        const dy = this.moveToPos.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI); // Angle in degrees

        return { dx, dy, distance, targetAngle };
    }

    // Determine if the object should move forward or backward to minimize rotation
    calculateMovementDirection(targetAngle) {
        this.angle = (this.angle + 360) % 360;  // Normalize current angle

        let forwardAngleDiff = (targetAngle - this.angle + 360) % 360;
        if (forwardAngleDiff > 180) forwardAngleDiff -= 360;

        let backwardAngleDiff = (targetAngle - (this.angle + 180) + 360) % 360;
        if (backwardAngleDiff > 180) backwardAngleDiff -= 360;

        const moveBackward = Math.abs(backwardAngleDiff) < Math.abs(forwardAngleDiff);
        const angleDifference = moveBackward ? backwardAngleDiff : forwardAngleDiff;

        return { moveBackward, angleDifference };
    }

    // Check if rotation is needed to align with target
    needsRotation(angleDifference) {
        const angleTolerance = 1;  // Tolerance for alignment
        return Math.abs(angleDifference) > angleTolerance;
    }

    // Rotate gradually towards the target angle
    rotateTowardsTarget(angleDifference) {
        const rotationSpeed = 1; // Rotation speed per frame
        if (angleDifference > 0) {
            this.angle += Math.min(rotationSpeed, angleDifference); // Rotate clockwise
        } else {
            this.angle -= Math.min(rotationSpeed, -angleDifference); // Rotate counterclockwise
        }
        this.angle = (this.angle + 360) % 360; // Normalize angle
        this.frame += 1;
    }

    // Move towards the target position in the determined direction
    moveInDirection(distance, moveBackward) {
        const moveSpeed = Math.min(this.speed, distance);
        const direction = moveBackward ? -1 : 1;
        this.position.x += Math.cos(this.angle * (Math.PI / 180)) * moveSpeed * direction;
        this.position.y += Math.sin(this.angle * (Math.PI / 180)) * moveSpeed * direction;
        this.frame += 1;
    }


    stop() {
        this.isStopped = true;
        this.moveToPos = JSON.parse(JSON.stringify(this.position));
        this.angle = JSON.parse(JSON.stringify(this.angle))
    };

    go() {
        this.isStopped = false;
    }

    collide(obj) {
        const dx = this.position.x - obj.position.x;
        const dy = this.position.y - obj.position.y;
        const collisionAngle = Math.atan2(dy, dx);

        this.position.x += Math.cos(collisionAngle) * obj.weight / 1000;
        this.position.y += Math.sin(collisionAngle) * obj.weight / 1000;

        obj.position.x -= Math.cos(collisionAngle) * this.weight / 1000;
        obj.position.y -= Math.sin(collisionAngle) * this.weight / 1000;
        //this.moveTo.y  =  this.position.y
        this.draw();

    }

    move() {
        this.moveMethod();
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

        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle * (Math.PI / 180));
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
        ctx.restore();
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

    fireMissileTo(ctx) {
        const targetAngle = this.calculateTargetAngle();
        const cannonGlobalAngle = this.calculateCannonGlobalAngle();
        const angleDifference = this.calculateAngleDifference(targetAngle, cannonGlobalAngle);

        this.adjustCannonAngle(angleDifference);
        if ( this.isAlignedWithTarget(angleDifference) && this.canShoot ) {
            this.fireMissile(ctx);
            this.canShoot = false;
        }
        if(!this.canShoot){
            this.canShoot = this.game.frame%this.reloadSpeed === 0;
        }

        this.normalizeCannonAngle();
    }

    // Calculate the angle to the target position
    calculateTargetAngle() {
        const dx = this.target.position.x - this.position.x;
        const dy = this.target.position.y - this.position.y;
        return Math.atan2(dy, dx) * (180 / Math.PI); // Target angle in degrees
    }

    // Calculate the cannon’s global angle by combining tank angle and cannon angle
    calculateCannonGlobalAngle() {
        let cannonGlobalAngle = (this.angle + this.cannonAngle) % 360;
        if (cannonGlobalAngle > 180) cannonGlobalAngle -= 360;
        if (cannonGlobalAngle < -180) cannonGlobalAngle += 360;
        return cannonGlobalAngle;
    }

    // Calculate the shortest angle difference between target and cannon angles
    calculateAngleDifference(targetAngle, cannonGlobalAngle) {
        let normalizedTargetAngle = ((targetAngle % 360) + 360) % 360;
        if (normalizedTargetAngle > 180) normalizedTargetAngle -= 360;

        let angleDifference = normalizedTargetAngle - cannonGlobalAngle;

        if (angleDifference > 180) angleDifference -= 360;
        if (angleDifference < -180) angleDifference += 360;

        return angleDifference;
    }

    // Adjust the cannon angle incrementally toward the target angle
    adjustCannonAngle(angleDifference) {
        const rotationStep = 1;
        if (Math.abs(angleDifference) > rotationStep) {
            this.cannonAngle += angleDifference > 0 ? rotationStep : -rotationStep;
        } else {
            this.cannonAngle += angleDifference;  // Snap to target if within rotation step
        }
    }

    // Check if the cannon is aligned with the target angle
    isAlignedWithTarget(angleDifference) {
        const rotationStep = 1;
        return Math.abs(angleDifference) <= rotationStep;
    }

    // Normalize the cannon angle to keep it within [-180, 180) for consistency
    normalizeCannonAngle() {
        this.cannonAngle = ((this.cannonAngle % 360) + 360) % 360;
        if (this.cannonAngle > 180) this.cannonAngle -= 360;
    }

    /** AUTOMATION *********************************************/

    findClosestTank() {
        let closestObject = null;
        let minDistance = Infinity;

        this.game.tanks.forEach(tank => {
            if (tank.id !== this.id) {
                const dx = tank.position.x - this.position.x;
                const dy = tank.position.y - this.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);  // Euclidean distance

                if (distance < minDistance) {
                    minDistance = distance;
                    closestObject = tank;
                }
            }
        });

        //if targets have remained
        if(closestObject){
            this.target = {...closestObject};
            //this.isFiring = this.game.frame%this.reloadSpeed === 0
         
            if(minDistance > 200){
                this.moveToPos = {...closestObject.position};        
                this.moveOrRotateCannon();
            }
                       
        }
        this.render();
    }

    checkIfObstaclesInTheWay() {

    }




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
