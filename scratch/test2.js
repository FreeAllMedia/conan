const AWS = require("aws-sdk");
const iam = new AWS.IAM({region: "us-east-1"});


iam.getRole({
	RoleName: "AWSLambda"
}, (error, roleData) => {
	if (error) { throw error; }
	console.log(roleData);
});

//
// const packageZipReadStream = s3.getObject({
// 	Bucket: "fam.thaumaturgy",
// 	Key: "async-test.zip"
// }).createReadStream();
//
// const packageZipWriteStream = fileSystem.createWriteStream("./tmp/async-test.zip");
//
// packageZipWriteStream.on("close", () => {
// 	console.log("Closed!");
// });
//
// packageZipReadStream.pipe(packageZipWriteStream);
