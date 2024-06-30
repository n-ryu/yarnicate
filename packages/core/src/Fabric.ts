import { Stitch } from "./Stitch";
import { Point } from "./type";
import { createIdGenerator } from "./util/createId";

const createFabricId = createIdGenerator("fabric");

export class Fabric {
  readonly id: string;
  readonly stitches: Stitch[];

  constructor() {
    this.id = createFabricId();
    this.stitches = [new Stitch({ x: 0, y: 0 })];
  }

  addStitch(position: Point) {
    const lastStitch = this.stitches.at(-1);
    const stitch = new Stitch(position, lastStitch);

    if (lastStitch) lastStitch.next = stitch;

    this.stitches.push(stitch);

    return this.stitches;
  }
}
