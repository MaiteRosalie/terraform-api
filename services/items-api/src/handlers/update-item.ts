// handlers/update-item.ts

import { APIGatewayProxyEventV2 } from "aws-lambda";

import { updateItem } from "../services/item-service.js";
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

  await updateItem(id, body.name);

  return json(204, null);
}