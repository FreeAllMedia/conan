// const AWS = require("aws-sdk");
// const s3 = new AWS.S3({region: "us-east-1"});
const fileSystem = require("fs");

const fileBuffer = fileSystem.readFileSync("./es6/lib/plugins/aws-lambda/spec/steps/fixtures/lambda.zip");

console.log("WTF M8?");

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
