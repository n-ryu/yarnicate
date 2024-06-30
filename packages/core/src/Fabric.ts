import { Stitch } from "./Stitch";
import { Point } from "./type";
import { createIdGenerator } from "./util/createId";

const createFabricId = createIdGenerator("fabric");

export class Fabric {
  readonly id: string;
  readonly stitches: Map<string, Stitch>;
  private _lastStitchId: string;

  constructor() {
    this.id = createFabricId();
    this.stitches = new Map<string, Stitch>();
    this._lastStitchId = "";

    this.addStitch({ x: 0, y: 0 });
  }

  get lastStitch() {
    return this.stitches.get(this._lastStitchId);
  }

  addStitch(position: Point) {
    const stitch = new Stitch(position, this.lastStitch);

    if (this.lastStitch) this.lastStitch.next = stitch;

    this.stitches.set(stitch.id, stitch);
    this._lastStitchId = stitch.id;

    return stitch;
  }

  undoStitch() {
    const secondLastStitch = this.lastStitch?.prev;
    if (!secondLastStitch) throw new Error("Cannot undo initial stitch");

    secondLastStitch.next = undefined;
    this.stitches.delete(this._lastStitchId);
    this._lastStitchId = secondLastStitch.id;
  }
}
