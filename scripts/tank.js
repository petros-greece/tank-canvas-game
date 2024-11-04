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
    this.range = options.range ?? this.size * 10;
    this.angle = options.angle ?? 360;
    this.cannonAngle = options.cannonAngle ?? 10;
    this.frame = Math.floor(Math.random() * 10);
    this.selected = false;
    this.stopped = false;
    // Component object for calculations or stored dimensions
    this.comp = {};
    this.init();
  }

  Tank.prototype.init = function () {
    this.comp.fullSize = 14 * this.size;
    this.comp.halfSize = 7 * this.size;
    this.comp.selectionSize = 10 * this.size;
    this.comp.isLockedDir = false;
    this.comp.lineDist = (this.comp.fullSize) / this.wheelTracksLineNum;
  }

  Tank.prototype.render = function () {

    const size = this.size;
    const ctx = this.ctx;

    this.renderSelection(ctx);
    this.renderBody(ctx, size);
    this.renderTracks(ctx, size);
    this.renderCannon(ctx, size);

  }

  Tank.prototype.renderCannon = function (ctx, size) {
    ctx.save();
    //ctx.rotate(this.cannonAngle * (Math.PI / 180));
    ctx.fillStyle = this.cannonFill;
    ctx.fillRect(2 * this.size, -0.5 * this.size, 6 * this.size, this.size);
    ctx.restore();
  }

  Tank.prototype.renderTracks = function (ctx, size) {
    // Draw tracks
    ctx.fillStyle = this.wheelTracksFill;
    ctx.fillRect(-this.comp.halfSize, -5.5 * size, this.comp.fullSize, 2 * size); // Upper track
    ctx.fillRect(-this.comp.halfSize, 3.5 * size, this.comp.fullSize, 2 * size); // Lower track

    // Draw wheels lines
    ctx.beginPath();
    ctx.strokeStyle = this.wheelTracksStroke;
    const lineDist = this.comp.lineDist;
    const frame = this.frame % lineDist;

    for (let i = 0; i < this.wheelTracksLineNum; i++) {
      ctx.moveTo(-this.comp.halfSize + (i * lineDist + frame), -3.5 * size);
      ctx.lineTo(-this.comp.halfSize + (i * lineDist + frame), -5.5 * size);
      ctx.moveTo(-this.comp.halfSize + (i * lineDist + frame), 3.5 * size);
      ctx.lineTo(-this.comp.halfSize + (i * lineDist + frame), 5.5 * size);
    }
    ctx.stroke();
  }

  Tank.prototype.renderBody = function (ctx, size) {
    // Draw tank body
    ctx.fillStyle = this.bodyFill;
    ctx.fillRect(-this.comp.halfSize, -3.5 * size, this.comp.fullSize, this.comp.halfSize);

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

    // Calculate shortest angle difference (clockwise or counterclockwise)
    let angleDifference = (targetAngle - this.angle + 360) % 360;
    if (angleDifference > 180) angleDifference -= 360; // Adjust to the shortest direction

    const rotationSpeed = 1; // Speed of rotation
    const angleTolerance = 1; // Angle tolerance to prevent oscillation

    // Rotate gradually toward the target angle if not aligned
    if (Math.abs(angleDifference) >= angleTolerance && distance > this.speed) {
      if (angleDifference > 0) {
        this.angle += Math.min(rotationSpeed, angleDifference); // Rotate clockwise
      } else {
        this.angle -= Math.min(rotationSpeed, -angleDifference); // Rotate counterclockwise
      }
      this.frame += 1;
    }

    // Move forward if aligned within tolerance of the target direction
    if (Math.abs(angleDifference) <= angleTolerance && distance > this.speed) {
      const moveSpeed = Math.min(this.speed, distance);
      this.position.x += Math.cos(this.angle * (Math.PI / 180)) * moveSpeed;
      this.position.y += Math.sin(this.angle * (Math.PI / 180)) * moveSpeed;
      this.frame += 1;
    }

    this.draw();

  };

  Tank.prototype.collide = function (otherTank) {
    const dx = this.position.x - otherTank.position.x;
    const dy = this.position.y - otherTank.position.y;
    const collisionAngle = Math.atan2(dy, dx);

    this.position.x += Math.cos(collisionAngle) * this.speed * 2;
    this.position.y += Math.sin(collisionAngle) * this.speed * 2;

    otherTank.position.x -= Math.cos(collisionAngle) * this.speed * 2;
    otherTank.position.y -= Math.sin(collisionAngle) * this.speed * 2;
    //this.moveTo.y  =  this.position.y
    this.draw();

  }

  Tank.prototype.draw = function () {
    // Draw tank with the updated position and angle
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle * (Math.PI / 180));
    this.render();
    ctx.restore();
  }

  Tank.prototype.checkIfClicked = function (position) {
    const size = this.size;

    // Tank dimensions centered on its position
    const halfWidth = this.comp.fullSize;
    const halfHeight = 7 * size;

    // Step 1: Translate the click position to the tank's local coordinate system
    const dx = position.x - this.position.x;
    const dy = position.y - this.position.y;

    // Step 2: Rotate the click point in the opposite direction of the tank's rotation
    const angleRad = -this.angle * (Math.PI / 180); // Convert angle to radians
    const rotatedX = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
    const rotatedY = dx * Math.sin(angleRad) + dy * Math.cos(angleRad);

    // Step 3: Check if the rotated click coordinates fall within the tank's rectangular boundaries
    const isWithinBounds = (
      rotatedX >= -halfWidth &&
      rotatedX <= halfWidth &&
      rotatedY >= -halfHeight &&
      rotatedY <= halfHeight
    );

    return isWithinBounds; // Returns true if within bounds, false otherwise
  };

  Tank.prototype.checkCollision = function (otherTank) {
    const dx = this.position.x - otherTank.position.x;
    const dy = this.position.y - otherTank.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Collision threshold based on tank size
    const collisionDistance = this.comp.halfSize + otherTank.comp.halfSize; // Adjust as needed based on tank size
    return distance < Math.floor(collisionDistance);
  };

  Tank.prototype.fireMisille = function(ctx){
    let misille = new Missile(ctx, {
      position: {
        x: this.position.x, 
        y: this.position.y-(this.size*2)
      },
      angle: this.angle,
      width: this.size,
      height: this.size*4
    });
    game.misilles.push(misille);
  }

