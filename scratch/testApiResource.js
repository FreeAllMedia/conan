const Conan = require("../es5/lib/conan.js");
const ConanAwsApiGatewayPlugin = require("../es5/lib/plugins/aws-gateway-api/conanAwsGatewayApiPlugin.js");

const conan = new Conan({
	region: "us-east-1"
});
conan.use(ConanAwsApiGatewayPlugin);

conan
	.api("nicoNew")
		.stage("development")
			.post("/accounts")
				.lambda("SomeLambda")
				.headers(["Access-Token", "Content-Type"])
				.queryStrings(["pageSize"])
				.responseHeaders({
					"Allow-Control-Allow-Origin": "*",
					"Allow-Control-Allow-Methods": "*",
					"Allow-Control-Allow-Headers": "Access-Token"
				})
				.statusCodes([200, 404, 401, 500])
			.options("/accounts")
				.responseHeaders({
					"Allow-Control-Allow-Origin": "*"
				})
				.statusCodes([200])
			.get("/accounts/{id}")
				.lambda("SomeLambda")
				.headers(["Access-Token", "Content-Type"])
				.queryStrings(["pageSize"])
				.responseHeaders({
					"Allow-Control-Allow-Origin": "*",
					"Allow-Control-Allow-Methods": "*",
					"Allow-Control-Allow-Headers": "Access-Token"
				})
				.statusCodes([200, 404, 401, 500])
			.put("/accounts/{id}")
				.lambda("SomeLambda")
				.headers(["Access-Token", "Content-Type"])
				.queryStrings(["pageSize"])
				.responseHeaders({
					"Allow-Control-Allow-Origin": "*",
					"Allow-Control-Allow-Methods": "*",
					"Allow-Control-Allow-Headers": "Access-Token"
				})
				.statusCodes([200, 404, 401, 500])
			.delete("/accounts/{id}")
				.lambda("SomeLambda")
				.headers(["Access-Token", "Content-Type"])
				.queryStrings(["pageSize"])
				.responseHeaders({
					"Allow-Control-Allow-Origin": "*",
					"Allow-Control-Allow-Methods": "*",
					"Allow-Control-Allow-Headers": "Access-Token"
				})
				.statusCodes([200, 404, 401, 500])
			.options("/accounts/{id}")
				.responseHeaders({
					"Allow-Control-Allow-Origin": "*"
				})
				.statusCodes([200]);

conan.deploy((error) => {
	console.log("Deployment complete.", { error });
});
