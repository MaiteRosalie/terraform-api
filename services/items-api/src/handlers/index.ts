// handlers/index.ts
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { handler as createItem } from "./create-item.js";
import { handler as getItem } from "./get-item.js";
import { handler as updateItem } from "./update-item.js";
import { handler as deleteItem } from "./delete-item.js";

export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  const method = event.requestContext.http.method;
  const path = event.rawPath;

  // Health check
  if (method === "GET" && path === "/") {
    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  }

  // Create
  if (method === "POST" && path === "/items") {
    return createItem(event as any);
  }

  // Extract ID safely from API Gateway v2
  const id = event.pathParameters?.id;

  // Get
  if (method === "GET" && id) {
    return getItem(event as any);
  }

  // Update
  if (method === "PUT" && id) {
    return updateItem(event as any);
  }

  // Delete
  if (method === "DELETE" && id) {
    return deleteItem(event as any);
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ message: "not found" }),
  };
}