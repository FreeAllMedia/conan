const Conan = require("../es5/lib/conan.js").default;
const ConanAwsLambdaPlugin = require("../es5/lib/plugins/aws-lambda/conanAwsLambdaPlugin.js");

const conan = new Conan({
	region: "us-east-1"
});
conan.use(ConanAwsLambdaPlugin);

conan
	.lambda("nicoTest", `${__dirname}/aLambda.js`, "nicoTestLambdaRole")
	.handler("handlerName");

conan.deploy((error) => {
	console.log("Deployment complete.", { error });
});
