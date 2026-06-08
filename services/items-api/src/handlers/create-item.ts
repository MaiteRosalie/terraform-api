// handlers/create-item.ts

import { APIGatewayProxyEventV2 } from "aws-lambda";
import { z } from "zod";

import { createItem } from "../services/item-service.js";
import { itemSchema } from "../validators/item.schema.js";
import { json } from "../utils/response.js";

export async function handler(
  event: APIGatewayProxyEventV2
) {
  const body = JSON.parse(event.body ?? "{}");
  const parsed = itemSchema.safeParse(body);

  if (!parsed.success) {
    const errors = z.treeifyError(parsed.error);

    return json(400, {
      message: "Invalid request body",
      errors
    });
  }

  const item = await createItem(parsed.data.name);

  return json(201, item);
}