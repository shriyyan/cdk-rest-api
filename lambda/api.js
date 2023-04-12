const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: process.env.DYNAMODB_TABLE,
};

const getAll = async (event, context) => {
  try {
    const result = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

const create = async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: data.id,
      title: data.title,
      description: data.description,
    },
  };

  try {
    const result = await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

module.exports = {
  getAll,
  create,
};
