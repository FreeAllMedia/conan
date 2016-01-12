const Conan = require("../es5/lib/conan.js");
const ConanAwsApiGatewayPlugin = require("../es5/lib/plugins/aws-gateway-api/conanAwsGatewayApiPlugin.js");

const conan = new Conan({
	region: "us-east-1"
});
conan.use(ConanAwsApiGatewayPlugin);

conan
	.api("nicoNew")
		.stage("development")
			.get("/accounts/{id}")
			.lambda("ListAccounts")
			.headers(["Access-Token", "Content-Type"])
			.queryStrings(["pageSize"])
			.statusCodes([200, 404, 401, 500]);

conan.deploy((error) => {
	console.log("Deployment complete.", { error });
});
