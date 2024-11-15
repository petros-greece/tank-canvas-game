import * as fabric from "fabric";
import { GameObject } from "./Objects";
import { ObjectOptions, Position, PublicMethodNames } from "../interfaces/Interfaces";
import { WorldObjects } from "./WorldObjects";

type WorldObjectGetter = PublicMethodNames<WorldObjects>;

export class FabricLayer extends WorldObjects{
  private canvas: fabric.Canvas;

  constructor(canvasId: string) {
    super();
    // Initialize the Fabric.js canvas
    this.canvas = new fabric.Canvas(canvasId);
    this.canvas.setWidth(window.innerWidth);
    this.canvas.setHeight(window.innerHeight);

  }

  // Method to add a rectangle
  public addRectangle(opts:fabric.TOptions<fabric.RectProps>): void {
    const rectangle = new fabric.Rect(opts);
    this.canvas.add(rectangle);
  }

  /****************************************************************************** */

  worldOptionsToFabric(gameObj: ObjectOptions) {
    const rectangle = new fabric.Rect(gameObj);
    this.canvas.add(rectangle);
  }

  fabricObjectToGameObject(fabricObj: fabric.Object, ctx: CanvasRenderingContext2D): GameObject {

    const width = fabricObj.width || 0;
    const height = fabricObj.height || 0;
    const color = fabricObj.get('fill') as string || 'black';
    const id = fabricObj.get('id') as string || undefined;
    const position: Position = {
      x: fabricObj.left + (width/2) || 0,
      y: fabricObj.top + (height/2) || 0,
    };

    const options: ObjectOptions = {
      position: position,
      width: width,
      height: height,
      color: color,
      weight: 1,
      angle: fabricObj.angle || 0,
      armor: 10,
      id: id,
      isBreakable: true,
    };

    return new GameObject(ctx, options);
  }

  transormAllObjectsToGameObjects(ctx: CanvasRenderingContext2D): GameObject[] {
    const objs: GameObject[] = [];
    this.canvas.forEachObject((obj: fabric.Object) => {
      objs.push(this.fabricObjectToGameObject(obj, ctx));
    });
    return objs;
  }

  giveObjectOpts(method:WorldObjectGetter) : ObjectOptions{
    return this[method]; 
  }



}

