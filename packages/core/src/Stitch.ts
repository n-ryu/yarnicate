import { createIdGenerator } from "./util/createId";

interface Point {
  x: number;
  y: number;
}

interface Line {
  start: Point;
  end: Point;
  center: Point;
}

export type PostType = "slip" | "single" | "half-double" | "double" | "treble";
export type BindType =
  | "default"
  | "front-loop"
  | "back-loop"
  | "front-post"
  | "back-post";

const createPostId = createIdGenerator("post");

class Post implements Line {
  readonly id: string;
  public bindType: BindType;
  public boundBy?: Post[];

  constructor(
    readonly parent: Stitch,
    public boundTo: Post | Stitch,
    public type: PostType
  ) {
    this.id = createPostId();
    this.bindType = "default";
  }

  get start(): Point {
    return this.parent.center;
  }

  get end(): Point {
    return this.boundTo.center;
  }

  get center(): Point {
    return {
      x: (this.start.x + this.end.x) / 2,
      y: (this.start.y + this.end.y) / 2,
    };
  }
}

const createStitchId = createIdGenerator("stitch");

export class Stitch implements Line {
  readonly id: string;
  public next?: Stitch;
  public posts: Post[];
  public boundBy: Post[];

  constructor(public end: Point, public prev?: Stitch) {
    this.id = createStitchId();
    this.posts = [];
    this.boundBy = [];
  }

  get start(): Point {
    return this.prev?.end ?? this.end;
  }

  get center(): Point {
    return {
      x: (this.start.x + this.end.x) / 2,
      y: (this.start.y + this.end.y) / 2,
    };
  }
}
