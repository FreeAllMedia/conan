/* eslint-disable no-console */
const Conan = require("../es5/lib/conan.js");

const conan = new Conan({
	region: "us-east-1",
	bucket: "conan.test"
});

conan
	.lambda("SomeLambda", __dirname + "/lambda.js", "AWSLambda")
	.lambda("PythonLambda", __dirname + "/lambda.py", "AWSLambda")
		.runtime("python2.7");

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
