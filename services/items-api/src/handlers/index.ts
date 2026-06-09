import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { handler as createItem } from "./create-item";
import { handler as getItem } from "./get-item";
import { handler as updateItem } from "./update-item";
import { handler as deleteItem } from "./delete-item";


function pathSegments(path: string) {
	return path.replace(/(^\/+|\/+$)/g, "").split("/").filter(Boolean);
}


export async function handler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {

  const { method } = event.requestContext.http;
  const { rawPath } = event;
  const segments = pathSegments(rawPath);


  	if ((rawPath === "/" || rawPath === "") && method === "GET") {
		return { statusCode: 200, body: JSON.stringify({ message: "ok" }) };
	}

	if (method === "POST" && rawPath === "/items") {
	return createItem(event);
	}

	if (method === "GET" && segments[0] === "items" && segments[1]) {
	return getItem({
		...event,
		pathParameters: { id: segments[1] },
	});
	}

	if ((method === "PUT" || method === "PATCH") &&
		segments[0] === "items" &&
		segments[1]) {
	return updateItem({
		...event,
		pathParameters: { id: segments[1] },
	});
	}

	if (method === "DELETE" &&
		segments[0] === "items" &&
		segments[1]) {
		return deleteItem({
			...event,
			pathParameters: { id: segments[1] },
		});
	}

	return { statusCode: 404, body: JSON.stringify({ message: "not found" }) };


}