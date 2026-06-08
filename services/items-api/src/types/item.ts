import type { ItemInput } from "../validators/item.schema.js";

export type Item = ItemInput & {
  id: string;
};
