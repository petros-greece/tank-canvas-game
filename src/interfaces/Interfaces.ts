import { Missile } from "./../classes/Missile";

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
    width?: number;
    height?: number;
    target?: any;
    moveMethod?: string;
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
    tanks?: TankOptions[];
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
    worldBuilders?: any[]; // Define a more specific type if available
    worldObjects?: GameObject[];
    tankOpts?: any[]; // Define a more specific type if available
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
    width?: number;
    height?: number;
    color?: string;
    weight?: number;
    angle?: number;
}

export interface BuilderOptions {
    num: number;
    dx: number;
    dy: number;
    sx: number;
    sy: number;
    sa: number;
}

