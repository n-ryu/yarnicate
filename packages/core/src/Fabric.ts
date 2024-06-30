import { Stitch } from "./Stitch";

export class Fabric {
  stitches: Stitch[];

  constructor() {
    this.stitches = [new Stitch({ x: 0, y: 0 })];
  }
}
