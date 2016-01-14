/* eslint-disable no-console */
const ConanLib = require("../es5/lib/conan.js");

console.log(ConanLib);

const Conan = ConanLib.default;
const ConanAwsLambdaPlugin = ConanLib.ConanAwsLambdaPlugin;
const ConanAwsApiGatewayPlugin = ConanLib.ConanAwsApiGatewayPlugin;

const conan = new Conan({
	region: "us-east-1",
	bucket: "conan.test"
});

conan.use(ConanAwsLambdaPlugin);
conan.use(ConanAwsApiGatewayPlugin);

conan
	.lambda("SomeLambda", __dirname + "/lambda.js", "AWSLambda")
		.handler("handler", __dirname + "/customHandler.js");

conan
	.api("MyAPI v1")
		.stage("development")
			.get("/someResource/{id}")
				.lambda("SomeLambda");

conan.deploy(() => {
	console.log("Deployment complete.");
});

// conan.lambda("JavaLambda", __dirname + "/src/java/something/lambda.java", "AWSLambda")
// 	.runtime("java")
// 	.dependencies("./pom.xml");

// conan
// 	.api("v1") // results = { apis: { "v1": { id: 9 } }
// 		.stage("production") // results = { apis: { "v1": { id: 9, stages: { "production" => { id: 7 } } } }
// 			.get("/accounts")  // results = {apis: { "v1": { id: 9, stages: { "production" => { id: 7, resources: { "/accounts": { get: {} }} } } } }
// 				.lambda("AccountsList")
// 		.stage("staging") // results = {apiId: 9, stageId: 2, resourceIds: { "/accounts": 4 }}
// 			.get("/accounts") // results = {apiId: 9, stageId: 2, resourceIds: { "/accounts": 5 }}
// 				.lambda("AccountsList")
