// handlers/create-item.ts

import { APIGatewayProxyEventV2 } from "aws-lambda";

import { createItem } from "../services/item-service.js";
import { json } from "../utils/response.js";

export async function handler(
  event: APIGatewayProxyEventV2
) {
  const body = JSON.parse(event.body ?? "{}");

  const item = await createItem(body.name);

  return json(201, item);
}