const AWS = require("aws-sdk");
const lambda = new AWS.Lambda({region: "us-east-1"});
const s3 = new AWS.S3({region: "us-east-1"});
const iam = new AWS.IAM({region: "us-east-1"});

const fs = require("fs");
const AdmZip = require("adm-zip");
const archiver = require('archiver');
const streamBuffers = require('stream-buffers');
const unzip = require('unzip');

// var params = {
//   Code: {
//     S3Bucket: "fam.thaumaturgy",
//     S3Key: "async-test.zip"
//   },
//   FunctionName: "TestFunction", /* required */
//   Handler: "", /* required */
//   Role: 'STRING_VALUE', /* required */
//   Runtime: 'nodejs | java8 | python2.7', /* required */
//   Description: 'STRING_VALUE',
//   MemorySize: 0,
//   Publish: true || false,
//   Timeout: 0
// };
//
// lambda.createFunction(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });

// iam.getRole({
// 	RoleName: "Bob"
// }, (error) => {
// 	console.log(error.statusCode);
// });

// lambda.invoke({
// 	FunctionName: "Thaumaturgy",
// 	Payload: JSON.stringify({
// 		packages: ["async"],
// 		bucket: "fam.thaumaturgy",
// 		key: "async-test.zip"
// 	})
// }, (error, data) => {
// 	console.log("error:", error);
// 	console.log("data:", data);
// });

// s3.getObject({
// 	Bucket: "fam.thaumaturgy",
// 	Key: "thaumaturgy.zip"
// }, (error, data) => {
// 	console.log("error:", error);
// 	console.log("data:", data);
// });

// s3.getObject({
// 	Bucket: "fam.thaumaturgy",
// 	Key: "thaumaturgy.zip"
// }, (error, data) => {
// 	console.log("error:", error);
// 	console.log("data:", data);
// });



const zipFileName = "async-test.zip";

lambda.invoke({
	FunctionName: "Thaumaturgy",
	Payload: JSON.stringify({
		packages: ["async"],
		bucket: "fam.thaumaturgy",
		key: zipFileName
	})
}, (error, data) => {
	const request = s3.getObject({
		Bucket: "fam.thaumaturgy",
		Key: zipFileName
	});

	const dependenciesFileName = `./tmp/${zipFileName}`;

	const readStream = request.createReadStream();
	const writeStream = fs.createWriteStream(dependenciesFileName);

	readStream.pipe(writeStream);

	writeStream.on("finish", () => {
		const lambdaZipFilename = "./tmp/lambda.zip";
		const lambdaZip = archiver('zip', {});
		const lambdaZipWriteStream = fs.createWriteStream(lambdaZipFilename);

		lambdaZip.pipe(lambdaZipWriteStream);

		const lambdaFilename = "./scratch/lambda.js";

		lambdaZip.append(fs.createReadStream(lambdaFilename), {name: "lambda.js"});

		fs.createReadStream(dependenciesFileName)
			.pipe(unzip.Parse())
			.on("entry", (entry) => {
				console.log("adding entry");
				lambdaZip.append(entry, {name: entry.path});
		  }).on("close", () => {
				console.log("finished unzipping")
				lambdaZip.finalize();
				lambdaZipWriteStream.on("close", () => {
					console.log("finished zipping");

					fs.readFile(lambdaZipFilename, (error, data) => {
						console.log("lambda zip file read");

						var params = {
							Code: {
								ZipFile: data
							},
							FunctionName: "TestFunction", /* required */
							Handler: "lambda.handler", /* required */
							Role: 'arn:aws:iam::166191841105:role/AWSLambda', /* required */
							Runtime: 'nodejs', /* required */
							MemorySize: 128,
							Publish: true,
							Timeout: 60
						};

						lambda.createFunction(params, function(err, data) {
							console.log("Lambda deployed");
							if (err) console.log(err, err.stack); // an error occurred
							else     console.log(data);           // successful response
						});
					});
				});
			});
	});
});
