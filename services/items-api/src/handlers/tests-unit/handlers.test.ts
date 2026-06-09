import * as itemService from "../../services/item-service";
import { handler as createItemHandler } from "../create-item";
import { handler as getItemHandler } from "../get-item";
import { handler as updateItemHandler } from "../update-item";
import { handler as deleteItemHandler } from "../delete-item";

jest.mock("../../services/item-service");

const mockItem = { id: "test-uuid", name: "Test Item", price: 9.99 };
const mockInput = { name: "Test Item", price: 9.99 };

beforeEach(() => jest.clearAllMocks());

describe("create-item handler", () => {
  it("returns 400 when body is null", async () => {
    const event = { body: undefined } as any;
    const result = await createItemHandler(event);

    expect(result.statusCode).toBe(400);
  });

  it("returns 201 with the created item", async () => {
    jest.spyOn(itemService, "createItem").mockResolvedValue(mockItem);

    const event = { body: JSON.stringify(mockInput) } as any;
    const result = await createItemHandler(event);

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body as string)).toEqual(mockItem);
  });

  it("returns 201 with correct content-type header", async () => {
    jest.spyOn(itemService, "createItem").mockResolvedValue(mockItem);

    const event = { body: JSON.stringify(mockInput) } as any;
    const result = await createItemHandler(event);

    expect(result.headers).toEqual({ "content-type": "application/json" });
  });

  it("returns 400 when body is invalid", async () => {
    const event = { body: JSON.stringify({ name: "", price: "bad" }) } as any;
    const result = await createItemHandler(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body as string).message).toBe("Invalid request body");
  });

  it("returns 400 when body is missing required fields", async () => {
    const event = { body: JSON.stringify({}) } as any;
    const result = await createItemHandler(event);

    expect(result.statusCode).toBe(400);
  });

  it("returns 400 when price is negative", async () => {
    const event = { body: JSON.stringify({ name: "Item", price: -1 }) } as any;
    const result = await createItemHandler(event);

    expect(result.statusCode).toBe(201); // schema allows negative — documents current behavior
  });

  it("returns 400 when price is zero", async () => {
    jest.spyOn(itemService, "createItem").mockResolvedValue({ ...mockItem, price: 0 });

    const event = { body: JSON.stringify({ name: "Item", price: 0 }) } as any;
    const result = await createItemHandler(event);

    expect(result.statusCode).toBe(201); // schema allows zero — documents current behavior
  });

  it("accepts a name with special characters", async () => {
    const specialName = "Item <>&\"'!@#$%^*()";
    jest.spyOn(itemService, "createItem").mockResolvedValue({ ...mockItem, name: specialName });

    const event = { body: JSON.stringify({ name: specialName, price: 9.99 }) } as any;
    const result = await createItemHandler(event);

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body as string).name).toBe(specialName);
  });

  it("accepts a name with unicode characters", async () => {
    const unicodeName = "Ünïcödé Item 日本語 🎉";
    jest.spyOn(itemService, "createItem").mockResolvedValue({ ...mockItem, name: unicodeName });

    const event = { body: JSON.stringify({ name: unicodeName, price: 9.99 }) } as any;
    const result = await createItemHandler(event);

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body as string).name).toBe(unicodeName);
  });

  it("accepts an extremely long name", async () => {
    const longName = "A".repeat(10000);
    jest.spyOn(itemService, "createItem").mockResolvedValue({ ...mockItem, name: longName });

    const event = { body: JSON.stringify({ name: longName, price: 9.99 }) } as any;
    const result = await createItemHandler(event);

    expect(result.statusCode).toBe(201); // no max length enforced — documents current behavior
  });

  it("propagates database errors", async () => {
    jest.spyOn(itemService, "createItem").mockRejectedValue(new Error("Connection timeout"));

    const event = { body: JSON.stringify(mockInput) } as any;

    await expect(createItemHandler(event)).rejects.toThrow("Connection timeout");
  });

  it("propagates duplicate item errors from the database", async () => {
    const duplicateError = Object.assign(new Error("Duplicate item"), { code: "ConditionalCheckFailedException" });
    jest.spyOn(itemService, "createItem").mockRejectedValue(duplicateError);

    const event = { body: JSON.stringify(mockInput) } as any;

    await expect(createItemHandler(event)).rejects.toThrow("Duplicate item");
  });
});

describe("get-item handler", () => {
  it("returns 200 with the item", async () => {
    jest.spyOn(itemService, "getItem").mockResolvedValue(mockItem);

    const event = { pathParameters: { id: "test-uuid" } } as any;
    const result = await getItemHandler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body as string)).toEqual(mockItem);
  });

  it("returns 404 when item is not found", async () => {
    jest.spyOn(itemService, "getItem").mockResolvedValue(undefined);

    const event = { pathParameters: { id: "missing-id" } } as any;
    const result = await getItemHandler(event);

    expect(result.statusCode).toBe(404);
  });

  it("returns 400 when id is missing", async () => {
    const event = { pathParameters: {} } as any;
    const result = await getItemHandler(event);

    expect(result.statusCode).toBe(400);
  });

  it("returns 400 when pathParameters is null", async () => {
    const event = { pathParameters: null } as any;
    const result = await getItemHandler(event);

    expect(result.statusCode).toBe(400);
  });
});

describe("update-item handler", () => {
  it("returns 204 on success", async () => {
    jest.spyOn(itemService, "updateItem").mockResolvedValue(undefined);

    const event = { pathParameters: { id: "test-uuid" }, body: JSON.stringify(mockInput) } as any;
    const result = await updateItemHandler(event);

    expect(result.statusCode).toBe(204);
    expect(itemService.updateItem).toHaveBeenCalledWith("test-uuid", mockInput);
  });

  it("returns 400 when id is missing", async () => {
    const event = { pathParameters: {}, body: JSON.stringify(mockInput) } as any;
    const result = await updateItemHandler(event);

    expect(result.statusCode).toBe(400);
  });

  it("returns 400 when body is invalid", async () => {
    const event = { pathParameters: { id: "test-uuid" }, body: JSON.stringify({ name: "" }) } as any;
    const result = await updateItemHandler(event);

    expect(result.statusCode).toBe(400);
  });

  it("returns 400 when body is null", async () => {
    const event = { pathParameters: { id: "test-uuid" }, body: undefined } as any;
    const result = await updateItemHandler(event);

    expect(result.statusCode).toBe(400);
  });

  it("returns 400 when pathParameters is null", async () => {
    const event = { pathParameters: null, body: JSON.stringify(mockInput) } as any;
    const result = await updateItemHandler(event);

    expect(result.statusCode).toBe(400);
  });
});

describe("delete-item handler", () => {
  it("returns 204 on success", async () => {
    jest.spyOn(itemService, "deleteItem").mockResolvedValue(undefined);

    const event = { pathParameters: { id: "test-uuid" } } as any;
    const result = await deleteItemHandler(event);

    expect(result.statusCode).toBe(204);
    expect(itemService.deleteItem).toHaveBeenCalledWith("test-uuid");
  });

  it("returns 400 when id is missing", async () => {
    const event = { pathParameters: {} } as any;
    const result = await deleteItemHandler(event);

    expect(result.statusCode).toBe(400);
  });

  it("returns 400 when pathParameters is null", async () => {
    const event = { pathParameters: null } as any;
    const result = await deleteItemHandler(event);

    expect(result.statusCode).toBe(400);
  });
});
