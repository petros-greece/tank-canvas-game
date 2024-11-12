import { MissileOptions } from "../interfaces/Interfaces";
  
export class Missile {
    ctx: CanvasRenderingContext2D;
    angle: number;
    position: { x: number; y: number };
    width: number;
    height: number;
    flameToggle: boolean;
    isExploding: boolean;
    explosionRadius: number;
    hasExploded: boolean;
    speed: number;
    weight: number;
    force: number;
    owner: string;
    comp: { halfW?: number; halfH?: number };
  
    constructor(ctx: CanvasRenderingContext2D, options: MissileOptions = {}) {
      this.ctx = ctx;

      this.angle = options.angle || 90;
      this.position = options.position || { x: 350, y: 130 };
      this.width = options.width ?? 4;
      this.height = options.height ?? 12;
      this.speed = options.speed || 16;
      this.weight = options.weight || 100;

      this.force = this.speed

      this.flameToggle = false;
      this.isExploding = false;
      this.explosionRadius = 0;
      this.hasExploded = false;
      this.owner = options.owner || 'nobody';
      this.comp = {};
      this.init();
    }
  
    init(): void {
      this.comp.halfW = this.width / 2;
      this.comp.halfH = this.height / 2;
    }
  
    render(): void {
      if (!this.hasExploded) {
        if (this.isExploding) {
          this.renderExplosion();
        } else {
          this.move();
          this.renderBody(this.ctx);
        }
      }
    }
  
    renderBody(ctx: CanvasRenderingContext2D): void {
      ctx.save();
  
      // Move the canvas origin to the missile's center
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate((this.angle + 90) * (Math.PI / 180));
  
      // Draw the missile body
      ctx.fillStyle = "#555";
      ctx.fillRect(-this.comp.halfW!, -this.comp.halfH!, this.width, this.height);
  
      // Draw the missile nose
      ctx.beginPath();
      ctx.moveTo(-this.comp.halfW!, -this.comp.halfH!);
      ctx.lineTo(0, -this.comp.halfH! - this.height / 3);
      ctx.lineTo(this.comp.halfW!, -this.comp.halfH!);
      ctx.fillStyle = "#E53935";
      ctx.fill();
      ctx.closePath();
  
      // Draw the flame behind the missile
      this.renderFlame(ctx, 0, this.comp.halfH!);
  
      ctx.restore();
    }
  
    renderFlame(ctx: CanvasRenderingContext2D, x: number, y: number): void {
      const flameSize = this.flameToggle ? this.width : this.width * 2;
      this.flameToggle = !this.flameToggle;
  
      // Flame color and shape
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - flameSize / 2, y + flameSize);
      ctx.lineTo(x + flameSize / 2, y + flameSize);
      ctx.closePath();
  
      // Gradient for the flame color
      const gradient = ctx.createRadialGradient(x, y, 0, x, y + flameSize, flameSize);
      gradient.addColorStop(0, "#FFA726");
      gradient.addColorStop(1, "#FF5722");
  
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  
    explode(): void {
      this.isExploding = true;
      this.explosionRadius = 0;
    }
  
    renderExplosion(): void {
      const maxRadius = 30;
      const fadeOutRadius = 40;
  
      this.explosionRadius += 2;
  
      const gradient = this.ctx.createRadialGradient(
        this.position.x + this.comp.halfW!,
        this.position.y + this.comp.halfH!,
        0,
        this.position.x + this.comp.halfW!,
        this.position.y + this.comp.halfH!,
        this.explosionRadius
      );
  
      gradient.addColorStop(0, "#FF6F00");
      gradient.addColorStop(0.5, "#FF8E53");
      gradient.addColorStop(1, "rgba(255, 87, 34, 0)");
  
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(
        this.position.x + this.comp.halfW!,
        this.position.y + this.comp.halfH!,
        this.explosionRadius,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
  
      if (this.explosionRadius > fadeOutRadius) {
        this.hasExploded = true;
      }
    }
  
    move(): void {
      this.position.x += Math.cos(this.angle * (Math.PI / 180)) * this.speed;
      this.position.y += Math.sin(this.angle * (Math.PI / 180)) * this.speed;
    }
  }


  