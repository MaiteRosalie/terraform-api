process.env.TABLE_NAME = "test-table";

import { handler as createItemHandler } from "../create-item";
import { handler as getItemHandler } from "../get-item";
import { handler as updateItemHandler } from "../update-item";
import { handler as deleteItemHandler } from "../delete-item";
import { dynamodb } from "../../infrastructure/dynamodb";

jest.mock("../../infrastructure/dynamodb", () => ({
  dynamodb: { send: jest.fn() },
}));

const mockSend = dynamodb.send as jest.Mock;

const mockItem = { id: "test-uuid", name: "Test Item", price: 9.99 };
const mockInput = { name: "Test Item", price: 9.99 };

jest.mock("crypto", () => ({ randomUUID: () => "test-uuid" }));

beforeEach(() => jest.clearAllMocks());

describe("create-item integration", () => {
  it("creates an item and returns 201 with the full item", async () => {
    mockSend.mockResolvedValue({});

    const event = { body: JSON.stringify(mockInput) } as any;
    const result = await createItemHandler(event);

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body as string)).toEqual(mockItem);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("returns 400 without calling DynamoDB when body is invalid", async () => {
    const event = { body: JSON.stringify({ name: "", price: "bad" }) } as any;
    const result = await createItemHandler(event);

    expect(result.statusCode).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns 400 without calling DynamoDB when body is missing", async () => {
    const event = { body: undefined } as any;
    const result = await createItemHandler(event);

    expect(result.statusCode).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("propagates DynamoDB errors", async () => {
    mockSend.mockRejectedValue(new Error("ProvisionedThroughputExceededException"));

    const event = { body: JSON.stringify(mockInput) } as any;

    await expect(createItemHandler(event)).rejects.toThrow("ProvisionedThroughputExceededException");
  });
});

describe("get-item integration", () => {
  it("returns 200 with the item from DynamoDB", async () => {
    mockSend.mockResolvedValue({ Item: mockItem });

    const event = { pathParameters: { id: "test-uuid" } } as any;
    const result = await getItemHandler(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body as string)).toEqual(mockItem);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("returns 404 when DynamoDB returns no item", async () => {
    mockSend.mockResolvedValue({ Item: undefined });

    const event = { pathParameters: { id: "missing-id" } } as any;
    const result = await getItemHandler(event);

    expect(result.statusCode).toBe(404);
  });

  it("returns 400 without calling DynamoDB when id is missing", async () => {
    const event = { pathParameters: {} } as any;
    const result = await getItemHandler(event);

    expect(result.statusCode).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("propagates DynamoDB errors", async () => {
    mockSend.mockRejectedValue(new Error("ResourceNotFoundException"));

    const event = { pathParameters: { id: "test-uuid" } } as any;

    await expect(getItemHandler(event)).rejects.toThrow("ResourceNotFoundException");
  });
});

describe("update-item integration", () => {
  it("updates the item and returns 204", async () => {
    mockSend.mockResolvedValue({});

    const event = { pathParameters: { id: "test-uuid" }, body: JSON.stringify(mockInput) } as any;
    const result = await updateItemHandler(event);

    expect(result.statusCode).toBe(204);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("returns 400 without calling DynamoDB when body is invalid", async () => {
    const event = { pathParameters: { id: "test-uuid" }, body: JSON.stringify({ name: "" }) } as any;
    const result = await updateItemHandler(event);

    expect(result.statusCode).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns 400 without calling DynamoDB when id is missing", async () => {
    const event = { pathParameters: {}, body: JSON.stringify(mockInput) } as any;
    const result = await updateItemHandler(event);

    expect(result.statusCode).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("propagates DynamoDB errors", async () => {
    mockSend.mockRejectedValue(new Error("ConditionalCheckFailedException"));

    const event = { pathParameters: { id: "test-uuid" }, body: JSON.stringify(mockInput) } as any;

    await expect(updateItemHandler(event)).rejects.toThrow("ConditionalCheckFailedException");
  });
});

describe("delete-item integration", () => {
  it("deletes the item and returns 204", async () => {
    mockSend.mockResolvedValue({});

    const event = { pathParameters: { id: "test-uuid" } } as any;
    const result = await deleteItemHandler(event);

    expect(result.statusCode).toBe(204);
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("returns 400 without calling DynamoDB when id is missing", async () => {
    const event = { pathParameters: {} } as any;
    const result = await deleteItemHandler(event);

    expect(result.statusCode).toBe(400);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("propagates DynamoDB errors", async () => {
    mockSend.mockRejectedValue(new Error("InternalServerError"));

    const event = { pathParameters: { id: "test-uuid" } } as any;

    await expect(deleteItemHandler(event)).rejects.toThrow("InternalServerError");
  });
});
