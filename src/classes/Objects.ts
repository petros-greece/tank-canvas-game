
import { ObjectOptions, Position } from "../interfaces/Interfaces";

export class GameObject {
    
    ctx: CanvasRenderingContext2D;
    position: Position;
    moveToPos: Position;
    width: number;
    height: number;
    color: string;
    team: string;
    isColliding: boolean;
    comp: any;
    speed: number;
    weight: number;
    angle: number;
    armor: number;
    moveToAngle: number;
    id?: string;
    isBreakable: boolean;
    damage: number;
    render: Function;
    isDestroyed: boolean;
  
    constructor(ctx: CanvasRenderingContext2D, options: ObjectOptions) {
      this.ctx = ctx;
      this.width = options.width || 30;
      this.height = options.height || 30;
      this.position = options.position || { x: 0, y: 0 };
      this.color = options.color || "#4CAF50";
      this.isBreakable = options.isBreakable || false;
      this.id = options.id || `Object_${new Date().getTime()}`;
      this.team = options.team || "Warriors";

      this.moveToPos = options.moveToPos || { ...this.position };
      this.isColliding = false;
      this.isDestroyed = false;
      this.comp = {};
      this.speed = 0;
      this.weight = options.weight || 1000;
      this.angle = options.angle || 0;
      this.armor = 1000;
      this.damage = 0;
      this.moveToAngle = 0;
      this.render = this.isBreakable ? () => this.renderBreakable() : () => this.renderBody();
      this.init();
    }
  
    init(): void {
      this.comp.halfW = this.width / 2;
      this.comp.halfH = this.height / 2;
      this.comp.damage = 0;
      this.position = this.position ? this.position : { x: this.comp.halfW, y: this.comp.halfH };
    }
  
    private renderBody(): void {
      if (this.isColliding) {
        this.moveTo();
      }
      this.drawBody();
    }

    private renderBreakable(): void {
      if (this.isColliding) {
        this.moveTo();
      }   
      this.drawBreakableBody();
    }

    private drawBody(){
      this.ctx.save();
      this.ctx.translate(this.position.x, this.position.y);
      this.ctx.rotate((this.angle * Math.PI) / 180);
      this.ctx.fillStyle = this.isColliding ? "#FF0000" : this.color;
      this.ctx.fillRect(-this.comp.halfW, -this.comp.halfH, this.width, this.height);
      this.ctx.restore();
    }

    private drawBreakableBody(){
      this.ctx.save();
      this.ctx.translate(this.position.x, this.position.y);
      this.ctx.rotate((this.angle * Math.PI) / 180);

      this.ctx.fillStyle = this.isColliding ? "#FF0000" : this.color;
      this.ctx.fillRect(-this.comp.halfW, -this.comp.halfH, this.width, this.height);

      this.ctx.fillStyle = `rgba(5,5,5,${this.comp.damage})`;
      this.ctx.fillRect(-this.comp.halfW, -this.comp.halfH, this.width, this.height);

      this.ctx.restore();     
    }

    getHit(missile: any): void {
      this.isColliding = true;
      const impactForce = (missile.speed * missile.weight) / (this.weight + missile.weight);
      const combinedAngle = missile.angle;
      const combinedAngleRadians = (combinedAngle * Math.PI) / 180;
      const moveX = Math.cos(combinedAngleRadians) * impactForce * 2;
      const moveY = Math.sin(combinedAngleRadians) * impactForce * 2;
      this.addDamage(100);
      if(this.weight < 10000){
        this.moveToPos = {
          x: this.position.x + moveX,
          y: this.position.y + moveY,
        };
        this.moveToAngle = combinedAngle;
      }
    }

    addDamage(damage: number){
      this.damage += damage;
      this.comp.damage =this.damage / this.armor;
      this.isDestroyed = this.comp.damage >= 1;
    }
  
    moveTo(): void {
      const dx = this.moveToPos.x - this.position.x;
      const dy = this.moveToPos.y - this.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
  
      if (distance < 2.5) {
        this.position.x = this.moveToPos.x;
        this.position.y = this.moveToPos.y;
        this.isColliding = false;
      } else {
        const stepX = dx / distance;
        const stepY = dy / distance;
        this.position.x += stepX;
        this.position.y += stepY;
      }
  
      const angleDiff = (this.moveToAngle - this.angle + 360) % 360;
      const rotationStep = 2;
  
      if (Math.abs(angleDiff) < rotationStep || Math.abs(angleDiff - 360) < rotationStep) {
        this.angle = this.moveToAngle;
      } else if (angleDiff < 180) {
        this.angle += rotationStep;
      } else {
        this.angle -= rotationStep;
      }
  
      this.angle = (this.angle + 360) % 360;
    }
  
    collide(obj: GameObject): void {
      const dx = this.position.x - obj.position.x;
      const dy = this.position.y - obj.position.y;
      const collisionAngle = Math.atan2(dy, dx);
  
      this.position.x += Math.cos(collisionAngle) * (obj.weight / 1000);
      this.position.y += Math.sin(collisionAngle) * (obj.weight / 1000);
  
      obj.position.x -= Math.cos(collisionAngle) * (this.weight / 1000);
      obj.position.y -= Math.sin(collisionAngle) * (this.weight / 1000);
    }




  }

  
  