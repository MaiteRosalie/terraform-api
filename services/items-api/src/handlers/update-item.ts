// handlers/update-item.ts

import { APIGatewayProxyEventV2 } from "aws-lambda";
import { z } from "zod";

import { updateItem } from "../services/item-service.js";
import { itemSchema } from "../validators/item.schema.js";
import { json } from "../utils/response.js";

export async function handler(
  event: APIGatewayProxyEventV2
) {
  const id = event.pathParameters?.id;

  if (!id) {
    return json(400, {
      message: "id is required"
    });
  }

  const body = JSON.parse(event.body ?? "{}");
  const parsed = itemSchema.safeParse(body);

  if (!parsed.success) {
    const errors = z.treeifyError(parsed.error);

    return json(400, {
      message: "Invalid request body",
      errors
    });
  }

  await updateItem(id, parsed.data.name);

  return json(204, null);
}