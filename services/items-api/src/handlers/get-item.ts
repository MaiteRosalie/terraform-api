// handlers/get-item.ts

import { APIGatewayProxyEventV2 } from "aws-lambda";

import { getItem } from "../services/item-service.js";
import { json } from "../utils/response.js";

export async function handler(
  event: APIGatewayProxyEventV2
) {
  const id = event.pathParameters?.id;

  if (!id) {
    return json(400, {
      message: "Item id is required"
    });
  }

  const item = await getItem(id);

  if (!item) {
    return json(404, {
      message: "Item not found"
    });
  }

  return json(200, item);
}