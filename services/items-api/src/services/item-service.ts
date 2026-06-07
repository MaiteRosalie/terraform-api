// services/item-service.ts

import { randomUUID } from "crypto";

import * as repository from "../repositories/item-repository.js";

export async function createItem(name: string) {
  return repository.create({
    id: randomUUID(),
    name
  });
}

export async function getItem(id: string) {
  return repository.get(id);
}

export async function updateItem(
  id: string,
  name: string
) {
  await repository.update(id, name);
}

export async function deleteItem(id: string) {
  await repository.remove(id);
}