const Conan = require("../es5/lib/conan.js").default;
const ConanAwsApiGatewayPlugin = require("../es5/lib/plugins/aws-api-gateway/conanAwsApiGatewayPlugin.js");

const conan = new Conan({
	region: "us-east-1"
});
conan.use(ConanAwsApiGatewayPlugin);

conan
	.api("nicoNew")
		.stage("development")
			.post("/accounts")
				.lambda("SomeLambda")
				.headers("Access-Token", "Content-Type")
				.queryStrings("pageSize")
				.responseHeaders({
					"Allow-Control-Allow-Origin": "*",
					"Allow-Control-Allow-Methods": "*",
					"Allow-Control-Allow-Headers": "Access-Token"
				})
				.statusCodes({
					"200": "",
					"404": "Not Found*",
					"401": "Unauthorized*",
					"500": "Internal*"
				})
			.options("/accounts")
				.responseHeaders({
					"Allow-Control-Allow-Origin": "*"
				})
				.statusCodes({
					"200": ""
				})
			.get("/accounts/{id}")
				.lambda("SomeLambda")
				.headers("Access-Token", "Content-Type")
				.queryStrings("pageSize")
				.responseHeaders({
					"Allow-Control-Allow-Origin": "*",
					"Allow-Control-Allow-Methods": "*",
					"Allow-Control-Allow-Headers": "Access-Token"
				})
				.statusCodes({
					"200": "",
					"404": "Not Found*",
					"401": "Unauthorized*",
					"500": "Internal*"
				})
			.put("/accounts/{id}")
				.lambda("SomeLambda")
				.headers("Access-Token", "Content-Type")
				.queryStrings("pageSize")
				.responseHeaders({
					"Allow-Control-Allow-Origin": "*",
					"Allow-Control-Allow-Methods": "*",
					"Allow-Control-Allow-Headers": "Access-Token"
				})
				.statusCodes({
					"200": "",
					"404": "Not Found*",
					"401": "Unauthorized*",
					"500": "Internal*"
				})
			.delete("/accounts/{id}")
				.lambda("SomeLambda")
				.headers("Access-Token", "Content-Type")
				.queryStrings("pageSize")
				.responseHeaders({
					"Allow-Control-Allow-Origin": "*",
					"Allow-Control-Allow-Methods": "*",
					"Allow-Control-Allow-Headers": "Access-Token"
				})
				.statusCodes({
					"200": "",
					"404": "Not Found*",
					"401": "Unauthorized*",
					"500": "Internal*"
				})
			.options("/accounts/{id}")
				.responseHeaders({
					"Allow-Control-Allow-Origin": "*"
				})
				.statusCodes({
					"200": "",
					"404": "Not Found*",
					"401": "Unauthorized*",
					"500": "Internal*"
				});

conan.deploy((error) => {
	console.log("Deployment complete.", { error });
});
