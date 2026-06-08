// services/item-service.ts

import { randomUUID } from "crypto";

import * as repository from "../repositories/item-repository.js";
import type { ItemInput } from "../validators/item.schema.js";

export async function createItem(item: ItemInput) {
  return repository.create({
    id: randomUUID(),
    ...item
  });
}

export async function getItem(id: string) {
  return repository.get(id);
}

export async function updateItem(
  id: string,
  item: ItemInput
) {
  await repository.update(id, item);
}

export async function deleteItem(id: string) {
  await repository.remove(id);
}
