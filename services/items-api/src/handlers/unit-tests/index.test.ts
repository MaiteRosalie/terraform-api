import { handler } from "../index";
import { handler as createItem } from "../create-item";
import { handler as getItem } from "../get-item";
import { handler as updateItem } from "../update-item";
import { handler as deleteItem } from "../delete-item";

jest.mock("../create-item");
jest.mock("../get-item");
jest.mock("../update-item");
jest.mock("../delete-item");

describe("Router Handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 for health check GET /", async () => {
    const event = {
      requestContext: { http: { method: "GET" } },
      rawPath: "/",
    } as any;

    const result = await handler(event);

    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify({ message: "ok" }),
    });

    expect(createItem).not.toHaveBeenCalled();
    expect(getItem).not.toHaveBeenCalled();
    expect(updateItem).not.toHaveBeenCalled();
    expect(deleteItem).not.toHaveBeenCalled();
  });

  it("should route POST /items to createItem", async () => {
    const event = {
      requestContext: { http: { method: "POST" } },
      rawPath: "/items",
    } as any;

    await handler(event);

    expect(createItem).toHaveBeenCalledWith(
      expect.objectContaining({
        rawPath: "/items",
      })
    );
  });

  it("should route GET /items/123 to getItem", async () => {
    const event = {
      requestContext: { http: { method: "GET" } },
      rawPath: "/items/123",
    } as any;

    await handler(event);

    expect(getItem).toHaveBeenCalledWith(
      expect.objectContaining({
        pathParameters: { id: "123" },
      })
    );
  });

  it("should route PUT /items/123 to updateItem", async () => {
    const event = {
      requestContext: { http: { method: "PUT" } },
      rawPath: "/items/123",
    } as any;

    await handler(event);

    expect(updateItem).toHaveBeenCalledWith(
      expect.objectContaining({
        pathParameters: { id: "123" },
      })
    );
  });

  it("should route PATCH /items/456 to updateItem", async () => {
    const event = {
      requestContext: { http: { method: "PATCH" } },
      rawPath: "/items/456",
    } as any;

    await handler(event);

    expect(updateItem).toHaveBeenCalledWith(
      expect.objectContaining({
        pathParameters: { id: "456" },
      })
    );
  });

  it("should route DELETE /items/789 to deleteItem", async () => {
    const event = {
      requestContext: { http: { method: "DELETE" } },
      rawPath: "/items/789",
    } as any;

    await handler(event);

    expect(deleteItem).toHaveBeenCalledWith(
      expect.objectContaining({
        pathParameters: { id: "789" },
      })
    );
  });

  it("should return 404 for unknown path", async () => {
    const event = {
      requestContext: { http: { method: "GET" } },
      rawPath: "/unknown",
    } as any;

    const result = await handler(event);

    expect(result).toEqual({
      statusCode: 404,
      body: JSON.stringify({ message: "not found" }),
    });
  });
});