import { itemSchema } from "../item.schema";

describe("itemSchema", () => {
  it("parses valid input", () => {
    const result = itemSchema.safeParse({ name: "Item", price: 9.999 });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ name: "Item", price: 10.00 });
    }
  });

  it("rounds price to 2 decimal places", () => {
    const result = itemSchema.safeParse({ name: "Item", price: 9.999 });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.price).toBe(10.00);
    }
  });

  it("fails when name is empty", () => {
    const result = itemSchema.safeParse({ name: "", price: 9.99 });

    expect(result.success).toBe(false);
  });

  it("fails when name is missing", () => {
    const result = itemSchema.safeParse({ price: 9.99 });

    expect(result.success).toBe(false);
  });

  it("fails when price is not a number", () => {
    const result = itemSchema.safeParse({ name: "Item", price: "bad" });

    expect(result.success).toBe(false);
  });

  it("fails when price is missing", () => {
    const result = itemSchema.safeParse({ name: "Item" });

    expect(result.success).toBe(false);
  });

  it("accepts a name with special characters", () => {
    const result = itemSchema.safeParse({ name: "Item <>&\"'!@#$%", price: 9.99 });

    expect(result.success).toBe(true);
  });

  it("accepts a name with unicode characters", () => {
    const result = itemSchema.safeParse({ name: "Ünïcödé 🎉", price: 9.99 });

    expect(result.success).toBe(true);
  });

  it("accepts an extremely long name", () => {
    const result = itemSchema.safeParse({ name: "A".repeat(10000), price: 9.99 });

    expect(result.success).toBe(true); // no max length enforced — documents current behavior
  });

  it("accepts zero price", () => {
    const result = itemSchema.safeParse({ name: "Item", price: 0 });

    expect(result.success).toBe(true); // no min price enforced — documents current behavior
  });

  it("accepts negative price", () => {
    const result = itemSchema.safeParse({ name: "Item", price: -1 });

    expect(result.success).toBe(true); // no min price enforced — documents current behavior
  });

  it("accepts a name with only whitespace", () => {
    const result = itemSchema.safeParse({ name: "   ", price: 9.99 });

    expect(result.success).toBe(true); // no whitespace-only guard — documents current behavior
  });
});
