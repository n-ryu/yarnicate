import { Post, Stitch } from "./Stitch";
import { Point } from "./type";
import { createIdGenerator } from "./util/idGenerator";

const createFabricId = createIdGenerator("fabric");

export class Fabric {
  readonly id: string;
  readonly stitches: Map<string, Stitch>;
  private _lastStitchId: string;

  constructor(data?: ReturnType<Fabric["toJson"]>) {
    this.id = createFabricId();
    this.stitches = new Map<string, Stitch>();
    this._lastStitchId = "";

    if (!data) {
      this.addStitch({ x: 0, y: 0 });
      return;
    }

    const dataToStitch = new Map<string, Stitch>();

    data.forEach((stitchData) => {
      const stitch = new Stitch(stitchData.pos);
      dataToStitch.set(stitchData.id, stitch);
      this.stitches.set(stitch.id, stitch);
    });

    data.forEach((stitchData) => {
      const stitch = dataToStitch.get(stitchData.id);
      if (!stitch) return;

      stitch.prev = dataToStitch.get(stitchData.prev ?? "");
      stitch.next = dataToStitch.get(stitchData.next ?? "");

      stitchData.posts.forEach((postData) => {
        const boundTo = dataToStitch.get(postData.boundTo);
        if (!boundTo) return;
        stitch.addPost(postData.type, boundTo, postData.bindType);
      });
    });

    this.stitches.forEach((stitch) => {
      if (stitch.next === undefined) this._lastStitchId = stitch.id;
    });
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

  toJson() {
    return [...this.stitches.values()].map(
      ({ id, end, prev, next, posts }) => ({
        id,
        pos: end,
        prev: prev?.id,
        next: next?.id,
        posts: posts.map(({ id, type, bindType, boundTo }) => ({
          id,
          type,
          bindType,
          boundTo: boundTo.id,
        })),
      })
    );
  }

  toGeometryJson() {
    const stitches: Pick<Stitch, "start" | "end">[] = [];
    const unflatPosts: Pick<Post, "type" | "bindType" | "start" | "end">[][] =
      [];

    [...this.stitches.values()].forEach(({ start, end, posts }) => {
      stitches.push({ start, end });
      unflatPosts.push(
        posts.map(({ type, bindType, start, end }) => ({
          start,
          end,
          type,
          bindType,
        }))
      );
    });

    return { stitches, posts: unflatPosts.flat() };
  }
}
