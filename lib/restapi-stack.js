const { Stack, Duration } = require("aws-cdk-lib");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const { RemovalPolicy } = require("aws-cdk-lib/core");
const { RestApi, LambdaIntegration } = require("aws-cdk-lib/aws-apigateway");
const { Function, Runtime, Code } = require("aws-cdk-lib/aws-lambda");
const lambda = require("aws-cdk-lib/aws-lambda");
const iam = require("@aws-cdk/aws-iam");

class RestapiStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // create dynamodb table named items
    const itemsTable = new dynamodb.Table(this, "items", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Create a Lambda function that returns a sample response
    const GetAllFunction = new Function(this, "getAll", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset("lambda"),
      handler: "api.getAll",
      environment: {
        DYNAMODB_TABLE: itemsTable.tableName,
      },
    });

    // add Scan permission to the Lambda function
    itemsTable.grantReadData(GetAllFunction);

    const CreateFunction = new Function(this, "create", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset("lambda"),
      handler: "api.create",
      environment: {
        DYNAMODB_TABLE: itemsTable.tableName,
      },
    });

    // add Scan permission to the Lambda function
    itemsTable.grantReadWriteData(CreateFunction);

    // Create an API Gateway and connect it with the Lambda function
    const api = new RestApi(this, "sampleApi", {
      restApiName: "object-store-api",
    });

    const integration = new LambdaIntegration(GetAllFunction);
    api.root.addMethod("GET", integration);
    api.root
      .addResource("create")
      .addMethod("POST", new LambdaIntegration(CreateFunction));
  }
}

module.exports = { RestapiStack };
