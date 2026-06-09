import { json } from "../response";

describe("json", () => {
  it("returns correct statusCode, headers, and serialized body", () => {
    const result = json(200, { message: "ok" });

    expect(result).toEqual({
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "ok" }),
    });
  });

  it("serializes null body", () => {
    const result = json(204, null);

    expect(result.body).toBe("null");
    expect(result.statusCode).toBe(204);
  });

  it("serializes array body", () => {
    const result = json(200, [1, 2, 3]);

    expect(result.body).toBe(JSON.stringify([1, 2, 3]));
  });
});
