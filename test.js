const AWS = require("aws-sdk");
const iam = new AWS.IAM({region: "us-east-1"});
iam.getRole({
	RoleName: "Bob"
}, (error) => {
	console.log(error.statusCode);
});
