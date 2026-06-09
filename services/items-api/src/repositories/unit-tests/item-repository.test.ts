process.env.TABLE_NAME = "test-table";

import { GetCommand, PutCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamodb } from "../../infrastructure/dynamodb";
import { create, get, remove, update } from "../item-repository";

jest.mock("../../infrastructure/dynamodb", () => ({
  dynamodb: { send: jest.fn() },
}));

const mockSend = dynamodb.send as jest.Mock;

const TABLE_NAME = "test-table";
const mockItem = { id: "test-uuid", name: "Test Item", price: 9.99 };
const mockInput = { name: "Test Item", price: 9.99 };

beforeEach(() => jest.clearAllMocks());

describe("item-repository", () => {
  describe("create", () => {
    it("sends a PutCommand and returns the item", async () => {
      mockSend.mockResolvedValue({});

      const result = await create(mockItem);

      expect(mockSend).toHaveBeenCalledWith(expect.any(PutCommand));
      expect(mockSend.mock.calls[0][0].input).toEqual({ TableName: TABLE_NAME, Item: mockItem });
      expect(result).toEqual(mockItem);
    });

    it("throws when DynamoDB send fails", async () => {
      mockSend.mockRejectedValue(new Error("DynamoDB error"));

      await expect(create(mockItem)).rejects.toThrow("DynamoDB error");
    });
  });

  describe("get", () => {
    it("sends a GetCommand and returns the item", async () => {
      mockSend.mockResolvedValue({ Item: mockItem });

      const result = await get("test-uuid");

      expect(mockSend).toHaveBeenCalledWith(expect.any(GetCommand));
      expect(mockSend.mock.calls[0][0].input).toEqual({ TableName: TABLE_NAME, Key: { id: "test-uuid" } });
      expect(result).toEqual(mockItem);
    });

    it("returns undefined when item does not exist", async () => {
      mockSend.mockResolvedValue({ Item: undefined });

      const result = await get("missing-id");

      expect(result).toBeUndefined();
    });

    it("throws when DynamoDB send fails", async () => {
      mockSend.mockRejectedValue(new Error("DynamoDB error"));

      await expect(get("test-uuid")).rejects.toThrow("DynamoDB error");
    });
  });

  describe("remove", () => {
    it("sends a DeleteCommand", async () => {
      mockSend.mockResolvedValue({});

      await remove("test-uuid");

      expect(mockSend).toHaveBeenCalledWith(expect.any(DeleteCommand));
      expect(mockSend.mock.calls[0][0].input).toEqual({ TableName: TABLE_NAME, Key: { id: "test-uuid" } });
    });

    it("throws when DynamoDB send fails", async () => {
      mockSend.mockRejectedValue(new Error("DynamoDB error"));

      await expect(remove("test-uuid")).rejects.toThrow("DynamoDB error");
    });
  });

  describe("update", () => {
    it("sends an UpdateCommand with correct expression", async () => {
      mockSend.mockResolvedValue({});

      await update("test-uuid", mockInput);

      expect(mockSend).toHaveBeenCalledWith(expect.any(UpdateCommand));
      expect(mockSend.mock.calls[0][0].input).toEqual({
        TableName: TABLE_NAME,
        Key: { id: "test-uuid" },
        UpdateExpression: "SET #name = :name, #price = :price",
        ExpressionAttributeNames: { "#name": "name", "#price": "price" },
        ExpressionAttributeValues: { ":name": mockInput.name, ":price": mockInput.price },
      });
    });

    it("throws when DynamoDB send fails", async () => {
      mockSend.mockRejectedValue(new Error("DynamoDB error"));

      await expect(update("test-uuid", mockInput)).rejects.toThrow("DynamoDB error");
    });
  });
});
