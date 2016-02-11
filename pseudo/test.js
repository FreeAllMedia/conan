/* eslint-disable no-console */
const Conan = require("../es5/lib/conan.js").default;
const ConanAwsLambdaPlugin = require("../es5/lib/conan.js").ConanAwsLambdaPlugin;
const ConanAwsApiGatewayPlugin = require("../es5/lib/plugins/aws-api-gateway/conanAwsApiGatewayPlugin.js");

const conan = new Conan({
	region: "us-east-1",
	bucket: "conan.test"
});

conan.use(ConanAwsLambdaPlugin);
conan.use(ConanAwsApiGatewayPlugin);

conan
	.lambda("SomeLambda", __dirname + "/lambda.js", "AWSLambda");

conan
	.api("My API")
		.stage("development")
			.get("/echoName/{id}")
				.lambda("SomeLambda")
				.statusCodes(200);

conan.deploy((error) => {
	if (error) { throw error; }
	console.log("Deployment complete.");
});
