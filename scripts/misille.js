function Missile(ctx, options = {}) {
    // Set up position with default values
    this.ctx = ctx;
    this.angle = options.angle || 90;
    this.position = this.position || {};
    this.position.x = options.position?.x ?? 350;  // Default x position
    this.position.y = options.position?.y ?? 130;  // Default y position
    this.width = options.width ?? 4;
    this.height = options.height ?? 12;
    this.flameToggle = false;
    this.isExploding = false;  // Explosion state
    this.explosionRadius = 0;  // Radius of the explosion effect
    this.hasExploded = false;
    this.speed = 16;
    this.comp = {}
    this.init()
  }

  Missile.prototype.init = function(){
    this.comp.halfW = this.width/2;
    this.comp.halfH = this.height/2;
  }

  Missile.prototype.render = function () {
    if (!this.hasExploded) {
      this.move();
      if (this.isExploding) {
        this.renderExplosion();
      } else {
        this.renderBody(this.ctx);
      }
    }
  };

  Missile.prototype.renderBody = function (ctx) {
    ctx.save(); // Save the current state

    // Move the canvas origin to the missile's center
    ctx.translate(this.position.x + this.comp.halfW, this.position.y + this.comp.halfH);
    ctx.rotate( (this.angle+90) * (Math.PI / 180) ); // Rotate the canvas by the missile's angle

    // Draw the missile body
    ctx.fillStyle = "#555";
    ctx.fillRect(-this.comp.halfW, -this.comp.halfH, this.width, this.height); // Centered rectangle

    // Draw the missile nose
    ctx.beginPath();
    ctx.moveTo(-this.comp.halfW, -this.comp.halfH); // Top left of the body
    ctx.lineTo(0, -this.comp.halfH - this.height / 3); // Tip of the nose
    ctx.lineTo(this.comp.halfW, -this.comp.halfH); // Top right of the body
    ctx.fillStyle = "#E53935";
    ctx.fill();
    ctx.closePath();

    // Draw the flame behind the missile
    this.renderFlame(ctx, 0, this.comp.halfH); // Position flame based on the rotated origin

    ctx.restore(); // Restore the original state
  };
  
  Missile.prototype.renderFlame = function (ctx, x, y) {
    // Alternate the flame size for a flickering effect
    let flameSize = this.flameToggle ? this.width : this.width * 2;
    this.flameToggle = !this.flameToggle;

    // Flame color and shape
    ctx.beginPath();
    ctx.moveTo(x, y); // Bottom center of missile
    ctx.lineTo(x - flameSize / 2, y + flameSize); // Left point of flame
    ctx.lineTo(x + flameSize / 2, y + flameSize); // Right point of flame
    ctx.closePath();

    // Gradient for the flame color
    const gradient = ctx.createRadialGradient(x, y, 0, x, y + flameSize, flameSize);
    gradient.addColorStop(0, "#FFA726"); // Orange
    gradient.addColorStop(1, "#FF5722"); // Darker orange

    ctx.fillStyle = gradient;
    ctx.fill();
  };

  Missile.prototype.explode = function () {
    this.isExploding = true;  // Set the explosion state
    this.explosionRadius = 0; // Start the explosion radius at 0
  };

  Missile.prototype.renderExplosion = function () {
    const maxRadius = 30; // Maximum radius for the explosion effect
    const fadeOutRadius = 40; // Radius at which the explosion will start to fade

    // Increase the explosion radius
    this.explosionRadius += 2;

    // Draw explosion with a radial gradient to simulate fading
    const gradient = this.ctx.createRadialGradient(
      this.position.x + this.comp.halfW,
      this.position.y + this.comp.halfH,
      0,
      this.position.x + this.comp.halfW,
      this.position.y + this.comp.halfH,
      this.explosionRadius
    );

    gradient.addColorStop(0, "#FF6F00"); // Bright orange at the center
    gradient.addColorStop(0.5, "#FF8E53"); // Lighter orange
    gradient.addColorStop(1, "rgba(255, 87, 34, 0)"); // Transparent at the edge

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(
      this.position.x + this.comp.halfW,
      this.position.y + this.comp.halfH,
      this.explosionRadius,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    // End explosion effect after reaching the fade-out radius
    if (this.explosionRadius > fadeOutRadius) {
      this.isExploding = false; // Reset explosion state
      this.explosionRadius = 0;  // Reset radius
    }
  };

  Missile.prototype.move = function(){
    this.position.x += Math.cos(this.angle * (Math.PI / 180)) * this.speed;
    this.position.y += Math.sin(this.angle * (Math.PI / 180)) * this.speed;
  }
