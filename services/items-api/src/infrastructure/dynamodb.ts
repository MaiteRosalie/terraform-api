import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";



const isLocal = process.env.ENVIRONMENT === "local";

const client = new DynamoDBClient({
  ...(isLocal && {
    endpoint: "http://host.docker.internal:8000",
    credentials: {
      accessKeyId: "local",
      secretAccessKey: "local",
    },
  })
});

export const dynamodb =
  DynamoDBDocumentClient.from(client);