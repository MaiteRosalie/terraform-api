// handlers/delete-item.ts

import { APIGatewayProxyEventV2 } from "aws-lambda";

import { deleteItem } from "../services/item-service.js";
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

  await deleteItem(id);

  return json(204, null);
}