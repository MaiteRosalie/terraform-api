import * as repository from "../../repositories/item-repository";
import { createItem, getItem, updateItem, deleteItem } from "../item-service";

jest.mock("../../repositories/item-repository");
jest.mock("crypto", () => ({ randomUUID: () => "test-uuid" }));

const mockInput = { name: "Test Item", price: 9.99 };
const mockItem = { id: "test-uuid", ...mockInput };

describe("item-service", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("createItem", () => {
    it("calls repository.create with a generated id", async () => {
      jest.spyOn(repository, "create").mockResolvedValue(mockItem);

      const result = await createItem(mockInput);

      expect(repository.create).toHaveBeenCalledWith({ id: "test-uuid", ...mockInput });
      expect(result).toEqual(mockItem);
    });
  });

  describe("getItem", () => {
    it("returns the item from the repository", async () => {
      jest.spyOn(repository, "get").mockResolvedValue(mockItem);

      const result = await getItem("test-uuid");

      expect(repository.get).toHaveBeenCalledWith("test-uuid");
      expect(result).toEqual(mockItem);
    });

    it("returns undefined when item does not exist", async () => {
      jest.spyOn(repository, "get").mockResolvedValue(undefined);

      const result = await getItem("missing-id");

      expect(result).toBeUndefined();
    });
  });

  describe("updateItem", () => {
    it("calls repository.update with id and input", async () => {
      jest.spyOn(repository, "update").mockResolvedValue(undefined);

      await updateItem("test-uuid", mockInput);

      expect(repository.update).toHaveBeenCalledWith("test-uuid", mockInput);
    });
  });

  describe("deleteItem", () => {
    it("calls repository.remove with the id", async () => {
      jest.spyOn(repository, "remove").mockResolvedValue(undefined);

      await deleteItem("test-uuid");

      expect(repository.remove).toHaveBeenCalledWith("test-uuid");
    });
  });
});
