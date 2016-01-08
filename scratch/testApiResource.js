const Conan = require("../es5/lib/conan.js");
const ConanAwsApiGatewayPlugin = require("../es5/lib/plugins/aws-gateway-api/conanAwsGatewayApiPlugin.js");

const conan = new Conan({
	region: "us-east-1"
});
conan.use(ConanAwsApiGatewayPlugin);

conan
	.api("niConan")
		.stage("niStage")
			.get("/accounts/items")
			.lambda("ListAccounts")
			.statusCodes([200, 404, 401, 500]);

conan.deploy((error) => {
	console.log("Deployment complete.", { error });
});
