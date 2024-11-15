import { ObjectOptions } from "../interfaces/Interfaces";

export class WorldObjects {
  private cW: number;
  private cH: number;
  private colors = {
    light: '#25f57b',
    medium: '#99742b',
    heavy: 'rgb(55,55,55)'
  };
  private dimensions: any;

  constructor() {
    this.cW = window.innerWidth;
    this.cH = window.innerHeight;
    this.initDimensions();
  }

  private initDimensions() {
    this.dimensions = {
      small: {
        height: this.cW / 40,
        width: this.cW / 40
      },
      medium: {
        height: this.cW / 30,
        width: this.cW / 30
      },
      large: {
        height: this.cW / 20,
        width: this.cW / 20
      }
    };
  }

  get smRectLight(): ObjectOptions {
    return {
      height: this.dimensions.small.width,
      width: this.dimensions.small.width,
      weight: 250,
      isBreakable: true,
      color: this.colors.light
    };
  }

  get smRectMedium(): ObjectOptions {
    return {
      height: this.dimensions.small.width,
      width: this.dimensions.small.width,
      weight: 500,
      isBreakable: true,
      color: this.colors.medium
    };
  }

  get smRectHeavy(): ObjectOptions {
    return {
      height: this.dimensions.small.width,
      width: this.dimensions.small.width,
      weight: 1000,
      isBreakable: false,
      color: this.colors.heavy
    };
  }

  get mdRectLight(): ObjectOptions {
    return {
      height: this.dimensions.medium.width,
      width: this.dimensions.medium.width,
      weight: 500,
      isBreakable: true,
      color: this.colors.light
    };
  }

  get mdRectMedium(): ObjectOptions {
    return {
      height: this.dimensions.medium.width,
      width: this.dimensions.medium.width,
      weight: 1000,
      isBreakable: true,
      color: this.colors.medium
    };
  }

  get mdRectHeavy(): ObjectOptions {
    return {
      height: this.dimensions.medium.width,
      width: this.dimensions.medium.width,
      weight: 2000,
      isBreakable: false,
      color: this.colors.heavy
    };
  }

  get lgRectLight(): ObjectOptions {
    return {
      height: this.dimensions.large.width,
      width: this.dimensions.large.width,
      weight: 1000,
      isBreakable: true,
      color: this.colors.light
    };
  }

  get lgRectMedium(): ObjectOptions {
    return {
      height: this.dimensions.large.width,
      width: this.dimensions.large.width,
      weight: 2000,
      isBreakable: false,
      color: this.colors.medium
    };
  }

  get lgRectHeavy(): ObjectOptions {
    return {
      height: this.dimensions.large.width,
      width: this.dimensions.large.width,
      weight: 10000,
      isBreakable: false,
      color: this.colors.heavy
    };
  }

}
