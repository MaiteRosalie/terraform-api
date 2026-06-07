// repositories/item-repository.ts

import {
  GetCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";

import { dynamodb } from "../infrastructure/dynamodb.js";
import { Item } from "../types/item";

const tableName = process.env.TABLE_NAME!;

export async function create(item: Item) {
  await dynamodb.send(
    new PutCommand({
      TableName: tableName,
      Item: item
    })
  );

  return item;
}

export async function get(id: string) {
  const result = await dynamodb.send(
    new GetCommand({
      TableName: tableName,
      Key: { id }
    })
  );

  return result.Item;
}

export async function remove(id: string) {
  await dynamodb.send(
    new DeleteCommand({
      TableName: tableName,
      Key: { id }
    })
  );
}

export async function update(
  id: string,
  name: string
) {
  await dynamodb.send(
    new UpdateCommand({
      TableName: tableName,
      Key: { id },
      UpdateExpression: "SET #name = :name",
      ExpressionAttributeNames: {
        "#name": "name"
      },
      ExpressionAttributeValues: {
        ":name": name
      }
    })
  );
}