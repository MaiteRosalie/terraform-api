const products = {
  prod_123: {
    id: "prod_123",
    name: "Wireless Headphones",
    price: 199.99,
  },
  prod_456: {
    id: "prod_456",
    name: "USB-C Cable",
    price: 12.99,
  },
};

export const handler = async (event) => {
  const productId = event.id;

  if (!productId) return { statusCode: 400, body: JSON.stringify({ error: "Product ID required" }) };

  const product = products[productId];

  if (!product) return { statusCode: 404, body: JSON.stringify({ error: "Product not found" }) };

  return {
    statusCode: 200,
    body: JSON.stringify(product),
  };
};