import { createIdGenerator } from "./createId";

it("On first call, returns string formatted in `{prefix}-0`", () => {
  const createId = createIdGenerator("id");

  const id = createId();

  expect(id).toBe("id-0");
});

it("On non-first call, returns string formatted in `{prefix}-{number}` where number increases by 1 per every calls", () => {
  const createId = createIdGenerator("id");

  createId();
  createId();
  const id = createId();

  expect(id).toBe("id-2");
});
