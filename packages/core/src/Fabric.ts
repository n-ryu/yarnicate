import { Post, Stitch } from "./Stitch";
import { Point } from "./type";
import { createIdGenerator } from "./util/idGenerator";

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

  static fromJson(stitches: ReturnType<Fabric["toJson"]>) {
    const fabric = new Fabric();
    const idMap = new Map<string, Stitch | Post>();

    const iterateStitches = (
      stitchJson: ReturnType<Fabric["toJson"]>[number]
    ) => {
      const stitch = fabric.addStitch(stitchJson.pos);
      idMap.set(stitchJson.id, stitch);

      stitchJson.posts.forEach((postJson) => {
        const boundTo = idMap.get(postJson.boundTo);
        if (!boundTo) throw new Error("invalid bind target");

        const post = stitch.addPost(postJson.type, boundTo, postJson.bindType);
        idMap.set(postJson.id, post);
      });

      const nextStitchJson = stitches.find(({ id }) => id === stitchJson.next);
      if (nextStitchJson) iterateStitches(nextStitchJson);
    };

    const initialStitch = stitches.find((stitch) => stitch.prev === undefined);
    if (!initialStitch || !fabric.lastStitch) return fabric;
    idMap.set(initialStitch.id, fabric.lastStitch);

    const secondStitch = stitches.find(({ id }) => id === initialStitch.next);
    if (!secondStitch) return fabric;
    iterateStitches(secondStitch);

    return fabric;
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
