class GameObject {
    constructor(ctx, options = {}) {
        this.ctx = ctx;
        this.position = options.position;  // Default position if none provided
        this.moveToPos = options.moveToPos || { ...this.position };  // Default moveToPos if none provided
        this.width = options.width || 30;  // Default width of the object
        this.height = options.height || 30;  // Default height of the object
        this.color = options.color || "#4CAF50";  // Default color
        this.isColliding = false;  // Track collision state
        this.comp = {}
        this.speed = 1;
        this.weight = options.weight || 1000;
        this.angle = options.angle || 0;
        this.moveToAngle = 0,
        this.init();
    }

    init() {
        this.comp.halfW = this.width / 2;
        this.comp.halfH = this.height / 2;
        this.position = this.position ? this.position : { x: this.comp.halfW, y: this.comp.halfH };
    }

    // Render the game object
    render() {
        if (this.isColliding) {
            this.moveTo();
        }
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle * Math.PI / 180);  // Convert angle to radians
        this.ctx.fillStyle = this.isColliding ? "#FF0000" : this.color;  // Change color if colliding
        this.ctx.fillRect(-this.comp.halfW, -this.comp.halfH, this.width, this.height);
        this.ctx.restore();
    };

    getHit(thing) {
        // Indicate a collision has occurred
        this.isColliding = true;

        // Calculate impact force based on `thing`'s speed and weight
        const impactForce = (thing.speed * thing.weight) / (this.weight + thing.weight);

        // Calculate resulting angle as a combination of `this.angle` and `thing.angle`
        const combinedAngle =thing.angle;


        // Convert combined angle to radians
        const combinedAngleRadians = combinedAngle * (Math.PI / 180);

        // Calculate movement towards new position based on impact force
        const moveX = Math.cos(combinedAngleRadians) * impactForce*10;
        const moveY = Math.sin(combinedAngleRadians) * impactForce*10;

        // Set the target position (`moveToPos`) based on calculated movement
        this.moveToPos = {
            x: this.position.x + moveX,
            y: this.position.y + moveY
        };

        //console.log(this.moveToPos.x, this.moveToPos.y, this.position.x, this.position.y);

        // Adjust the object's angle to reflect the new direction
        this.moveToAngle = combinedAngle; // Keep angle within 0-359 degrees
    }


    moveTo() {
        // Calculate the distance to the target position
        const dx = this.moveToPos.x - this.position.x;
        const dy = this.moveToPos.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Check if we're close enough to the target position
        if (distance < 2.5) {  // Stop if close enough (threshold distance)
            this.position.x = this.moveToPos.x;
            this.position.y = this.moveToPos.y;
            this.isColliding = false;  // Clear collision state
        } else {
            // Calculate the step size based on speed and direction
            const stepX = (dx / distance);
            const stepY = (dy / distance);

            //console.log(stepX, stepY, distance);
            // Update the position
            this.position.x += stepX;
            this.position.y += stepY;
        }

        // Calculate the angle difference to the target angle
        const angleDiff = (this.moveToAngle - this.angle + 360) % 360;
        const rotationStep = 2;  // Set a fixed step for gradual rotation

        //Gradually rotate towards the target angle
        if (Math.abs(angleDiff) < rotationStep || Math.abs(angleDiff - 360) < rotationStep) {
            this.angle = this.moveToAngle;  // Snap to target angle if close enough
        } else if (angleDiff < 180) {
            this.angle += rotationStep;  // Rotate clockwise
        } else {
            this.angle -= rotationStep;  // Rotate counterclockwise
        }

        // Keep angle within 0-359 degrees
        this.angle = (this.angle + 360) % 360;
    }

    
    collide(obj) {
        const dx = this.position.x - obj.position.x;
        const dy = this.position.y - obj.position.y;
        const collisionAngle = Math.atan2(dy, dx);

        this.position.x += Math.cos(collisionAngle)  * obj.weight/1000;
        this.position.y += Math.sin(collisionAngle)  * obj.weight/1000;

        obj.position.x -= Math.cos(collisionAngle) * this.weight/1000;
        obj.position.y -= Math.sin(collisionAngle) * this.weight/1000;
        //this.moveTo.y  =  this.position.y

    }

    



}







