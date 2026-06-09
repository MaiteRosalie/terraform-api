import type { ItemInput } from "../validators/item.schema";

export type Item = ItemInput & {
  id: string;
};
