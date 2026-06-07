// handlers/index.ts
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

import { handler as createItem } from "./create-item.js";
import { handler as getItem } from "./get-item.js";
import { handler as updateItem } from "./update-item.js";
import { handler as deleteItem } from "./delete-item.js";

function pathSegments(path: string) {
	return path.replace(/(^\/+|\/+$)/g, "").split("/").filter(Boolean);
}

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
	const method = event.requestContext?.http?.method ?? (event as any).httpMethod;
	const rawPath = event.rawPath ?? (event as any).path ?? "/";

	const segments = pathSegments(rawPath);

	// Root health check
	if ((rawPath === "/" || rawPath === "") && method === "GET") {
		return { statusCode: 200, body: JSON.stringify({ message: "ok" }) };
	}

	// POST /items -> create
	if (method === "POST" && (segments.length === 0 || segments[0] === "items")) {
		return createItem(event as any);
	}

	// GET /items/{id} -> get
	if (method === "GET" && segments[0] === "items" && segments[1]) {
		// populate pathParameters for downstream handlers
		(event as any).pathParameters = { id: segments[1] };
		return getItem(event as any);
	}

	// PUT /items/{id} -> update
	if ((method === "PUT" || method === "PATCH") && segments[0] === "items" && segments[1]) {
		(event as any).pathParameters = { id: segments[1] };
		return updateItem(event as any);
	}

	// DELETE /items/{id} -> delete
	if (method === "DELETE" && segments[0] === "items" && segments[1]) {
		(event as any).pathParameters = { id: segments[1] };
		return deleteItem(event as any);
	}

	return { statusCode: 404, body: JSON.stringify({ message: "not found" }) };
}
