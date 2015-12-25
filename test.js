const AWS = require("aws-sdk");
const lambda = new AWS.Lambda({region: "us-east-1"});
lambda.getFunction({
	FunctionName: "Bob"
}, (error) => {
	console.log(error.statusCode);
});
