const Conan = require("../es5/lib/conan.js");
const ConanAwsApiGatewayPlugin = require("../es5/lib/plugins/aws-gateway-api/conanAwsGatewayApiPlugin.js");

const conan = new Conan({
	region: "us-east-1"
});
conan.use(ConanAwsApiGatewayPlugin);

conan.api("niConan");

conan.deploy(() => {
	console.log("Deployment complete.");
});
