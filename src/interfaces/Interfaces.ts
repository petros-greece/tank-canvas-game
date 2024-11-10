import { Missile } from "./../classes/Missile";
import { WorldBuilder } from "../classes/WorldBuilder";
import { TankBuilder } from "../classes/TankBuilder";

export type PublicMethodNames<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
  }[keyof T];

export type Direction = "up" | "down" | "left" | "right";

export interface Position {
    x: number;
    y: number;
}

export interface MissileOptions {
    angle?: number;
    position?: { x: number; y: number };
    width?: number;
    height?: number;
    owner?: string;
}

export interface Tank {
    ctx: CanvasRenderingContext2D;
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
    size: number;
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
    moveMethod?: string;
    armor?: number;
    isSelected?:boolean;
}

export interface Game {
    frame: number;
    tanks: any[];
    addMissile: (missile: Missile) => void;
}

export interface GameObject {
    ctx: CanvasRenderingContext2D;
    position: Position;
    moveToPos: Position;
    width: number;
    height: number;
    color: string;
    isColliding: boolean;
    comp: any;   // You may want to replace 'any' with a more specific type if possible
    speed: number;
    weight: number;
    angle: number;
    armor: number;
    damage: number;
    moveToAngle: number;
    id?: string;  // Optional property
}

export interface GameOptions {
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
    worldBuilders?: {builderOpts:BuilderOptions, buildMethod: PublicMethodNames<WorldBuilder>, objectOpts: ObjectOptions}[]; // Define a more specific type if available
    tankBuilders?:  {builderOpts:BuilderOptions, buildMethod: PublicMethodNames<TankBuilder>, objectOpts: TankOptions}[]; // Specify a more precise type if possible

    worldObjects?: GameObject[];
    tankOpts?: TankOptions[]; // Define a more specific type if available
}

export interface MissileOptions {
    angle?: number;
    position?: { x: number; y: number };
    width?: number;
    height?: number;
    owner?: string;
}

export interface ObjectOptions {
    id?: string;
    position?: Position;
    moveToPos?: Position;
    width: number;
    height: number;
    color?: string;
    weight?: number;
    angle?: number;
}

export interface BuilderOptions {
    num?: number;
    dx?: number;
    dy?: number;
    sx?: number;
    sy?: number;
    sa?: number;
    type?: string;
    dir?: Direction;
}
