import { Missile } from "./../classes/Missile";
import { WorldBuilder } from "../classes/WorldBuilder";
import { TankBuilder } from "../classes/TankBuilder";

export type PublicMethodNames<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
  }[keyof T];

export type BuildTankMethod = 'giveTeamOfTanks';
export type RenderTankMethod =   'veryLightTank' | 'lightTank' | 'mediumTank' | 'heavyTank';
export type MoveTankMethod = 'moveTo' | 'findClosestTank' | 'render';

export type BuildObjectMethod = 'giveTeamOfObjects';
export type RenderObjectMethod = | 'smLight' | 'smMedium' | 'smHeavy' 
                                 | 'mdLight' | 'mdMedium' | 'mdHeavy' 
                                 | 'lgLight' | 'lgMedium' | 'lgHeavy';

export type Direction = "up" | "down" | "left" | "right";

export interface Position {
    x: number;
    y: number;
}

/***************************************************** */

export interface Tank {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    cW: number;
    cH: number;
    team: string;
    id: string;
    game: Game;

    position: Position;
    moveToPos: Position;
    target: any;  // Replace with a more specific type if available
    bodyFill: string;
    towerFill: string;
    cannonFill: string;
    wheelTracksStroke: string;
    wheelTracksFill: string;
    wheelTracksLineNum: number;
    selectionColor: string;

    size: number;
    width: number;
    height: number;
    speed: number;
    angle: number;
    cannonAngle: number;
    frame: number;
    isFiring: boolean;
    weight: number;
    reloadSpeed: number;

    armor: number;
    damage: number;
    isSelected: boolean;
    isColliding: boolean;
    isStopped: boolean;
    canShoot: boolean;

    comp: { [key: string]: any };  // Replace `any` with specific types if known

    isExploding?: boolean;
    explosionRadius: number;
    explosionMaxRadius?: number;
    explosionFadeOutRadius: number;
    isDestroyed?: boolean;
    moveMethod?: string;

    inBounds: boolean;

    move: () => void;  // Define parameters if move takes any
}

export interface TankOptions {
    team?: string;
    id?: string;
    position?: Position;
    moveToPos?: Position;
    bodyFill?: string;
    towerFill?: string;
    cannonFill?: string;
    wheelTracksStroke?: string;
    wheelTracksFill?: string;
    wheelTracksLineNum?: number;
    selectionColor?: string;
    size?: number;
    speed?: number;
    angle?: number;
    cannonAngle?: number;
    isFiring?: boolean;
    weight?: number;
    reloadSpeed?: number;
    move?: string;
    explosionRadius?: number;
    explosionFadeOutRadius?: number;
    target?: any;
    moveMethod?: MoveTankMethod;
    armor?: number;
    isSelected?:boolean;
}

export type TankBuilderOptions = {
    builderOpts:BuilderOptions, 
    buildTankMethod: BuildTankMethod, 
    tankOpts: TankOptions, 
    frameInterval: number, 
    repetitions: number
};


/***************************************************** */

export interface GameObject {
    ctx: CanvasRenderingContext2D;
    position: Position;
    moveToPos: Position;
    width: number;
    height: number;
    color: string;
    isColliding: boolean;
    comp: any;   
    speed: number;
    weight: number;
    angle: number;
    armor: number;
    damage: number;
    moveToAngle: number;
    id?: string;  
    isBreakable: boolean;
}

export interface ObjectOptions {
    width: number;
    height: number;
    id?: string;
    position?: Position;
    moveToPos?: Position;
    color?: string;
    weight?: number;
    angle?: number;
    isBreakable?: boolean;
    team?: string;
}

export type WorldBuilderOptions = {
    builderOpts:BuilderOptions, 
    buildMethod:BuildObjectMethod, 
    objectOpts: ObjectOptions
}


/***************************************************** */

export interface StageI {
    frame: number;
    tanks: any[];
    worldObjects: any[];
    addMissile: (missile: Missile) => void;
}

export interface StageOptions {
    tanks?: Tank[];
    missiles?: Missile[];
    objects?: GameObject[];
    stage?: number;
    score?: number;
    time?: number;
    stats?: {
        kills: number;
        hits: number;
        shotsFired: number;
        accuracy: number;
    };
    settings?: {
        difficulty: string;
        maxMissiles: number;
        maxTanks: number;
        stageBackground: string;
    };
    worldBuilders: WorldBuilderOptions[]; // Define a more specific type if available
    tankBuilders: TankBuilderOptions[]; // Specify a more precise type if possible
    tankOpts: TankOptions[]; // Define a more specific type if available
    worldObjects?: GameObject[];
}

export interface StageBuilderOptions {
    worldBuilders: { 
        method: PublicMethodNames<WorldBuilder>, 
        builderOpts: BuilderOptions, 
        objectOpts: ObjectOptions }[];
    tankBuilders: {    
        method: PublicMethodNames<TankBuilder>, 
        tankType: RenderTankMethod, 
        builderOpts:BuilderOptions, 
        frameInterval: number, 
        repetitions: number
    }[],
    tankOpts?: TankOptions[];
}


/*************************************************************************************************** */


export interface MissileOptions {
    angle?: number;
    position?: Position;
    width?: number;
    height?: number;
    owner?: string;
    speed?: number;
    weight?: number;
}

export interface BuilderOptions {
    x?:number;
    y?:number;
    num?: number;
    dx?: number;
    dy?: number;
    sx?: number;
    sy?: number;
    sa?: number;
    type?: string;
    dir?: Direction;
    dividerX?: number;
    dividerY?: number;
    materialType?: RenderObjectMethod;
}

export interface Game {
    frame: number;
    tanks: any[];
    addMissile: (missile: Missile) => void;
}








