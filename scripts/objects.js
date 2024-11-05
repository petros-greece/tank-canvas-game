function GameObject(ctx, options = {}) {
    this.ctx = ctx;
    this.position = options.position || { x: 100, y: 100 };  // Default position if none provided
    this.width = options.width || 30;  // Default width of the object
    this.height = options.height || 30;  // Default height of the object
    this.color = options.color || "#4CAF50";  // Default color
    this.isColliding = false;  // Track collision state
    this.comp = {}
    this.speed = 0;
    this.init();
}

GameObject.prototype.init = function(){
    this.comp.halfW = this.width/2;
    this.comp.halfH = this.height/2;
}

// Render the game object
GameObject.prototype.render = function () {
    this.ctx.save();
    this.ctx.fillStyle = this.isColliding ? "#FF0000" : this.color;  // Change color if colliding
    this.ctx.fillRect(this.position.x - this.comp.halfW, this.position.y - this.comp.halfH , this.width, this.height);  // Draw rectangle
    this.ctx.restore();
};

// Check collision with a missile
GameObject.prototype.detectCollision = function (missile) {
    // Calculate the boundaries of the game object and the missile
    const objLeft = this.position.x;
    const objRight = this.position.x + this.width;
    const objTop = this.position.y;
    const objBottom = this.position.y + this.height;

    const missileLeft = missile.position.x;
    const missileRight = missile.position.x + missile.width;
    const missileTop = missile.position.y;
    const missileBottom = missile.position.y + missile.height;

    // Check if the missile is overlapping with this game object
    if (
        missileRight > objLeft &&
        missileLeft < objRight &&
        missileBottom > objTop &&
        missileTop < objBottom
    ) {
        this.isColliding = true;
        missile.explode();  // Trigger missile explosion on collision
        return true;
    } else {
        this.isColliding = false;
        return false;
    }
};

// Update method for the game object
GameObject.prototype.update = function (missiles) {
    // Check collision with each missile
    for (let missile of missiles) {
        this.detectCollision(missile);
    }

    // Render the object
    this.render();
};
