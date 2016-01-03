const packageJson = require("../package.json");
const Conan = require("../es5/lib/conan.js");
const ConanAwsLambdaPlugin = require("../es5/lib/plugins/aws-lambda/conanAwsLambdaPlugin.js");

const conan = new Conan({
	region: "us-east-1",
	bucket: "conan.test"
});

conan.use(ConanAwsLambdaPlugin);

conan.lambda(
	"SuperLambda",
	__dirname + "/lambda.js"
)
	.packages({
		temp: packageJson.dependencies.temp
	})
	.dependencies(__dirname + "/itWorks.js")
	.role("AWSLambda");

conan.deploy(() => {
	console.log("Deployment complete.");
});

//-------


























/**
 * compileDependenciesStep
 */


// zip.append(fs.createReadStream(__dirname + "/example.js"), {name: "something.js"});

// fs.createReadStream(__dirname + "/dependencies.zip")
// 	.pipe(unzip.Parse())
// 	.on("entry", entry => {
// 		console.log(entry.path);
// 	})
// 	.on("close", () => {
// 		console.log("CLOSED.");
// 	});

//
// const zip = archiver("zip", {});
// fs.createReadStream(__dirname + "/dependencies.zip")
// 	.pipe(unzip.Parse())
// 	.on("entry", entry => {
// 		const lastChar = entry.path.slice(-1);
// 		if (lastChar !== "/") {
// 			console.log(entry.path);
// 		}
// 	})
// 	.on("close", () => {
// 		console.log("CLOSED");
// 	});


// const zipFileName = "async-test.zip";
//
// console.log("Building dependencies on Lambda");
// lambda.invoke({
// 	FunctionName: "Thaumaturgy",
// 	Payload: JSON.stringify({
// 		packages: {"async": "1.0.0"},
// 		bucket: "fam.thaumaturgy",
// 		key: zipFileName
// 	})
// }, (error, data) => {
// 	console.log("Downloading dependencies zip data from S3");
// 	const dependencyZipStream = s3.getObject({
// 		Bucket: "fam.thaumaturgy",
// 		Key: zipFileName
// 	}).createReadStream();
//
// 	const dependencyZipWriteStream = fs.createWriteStream("./tmp/dependencies.zip");
// 	dependencyZipStream.pipe(dependencyZipWriteStream);
//
// 	dependencyZipWriteStream.on("close", () => {
// 		yauzl.open("./tmp/dependencies.zip", (error, zipfile) => {
// 			if (error) { throw error; }
// 			zipfile.on("entry", (entry) => {
// 				console.log(entry.fileName);
// 			});
// 			zipfile.on("end", () => {
// 				console.log("END");
// 			});
// 		});
// 	});


	// console.log("Creating empty lambda zip");
	// var lambdaZip = archiver('zip', {});
	//
	// console.log("Adding file to lambda zip:  lambda.js");
	// lambdaZip.append(fs.createReadStream("./scratch/lambda.js"), {name: "lambda.js"});
	//
	// dependencyZipStream
	// 	.pipe(unzip.Parse())
	// 	.on("entry", (entry) => {
	// 		console.log("Adding file to lambda zip: ", entry.path);
	// 		lambdaZip.append(entry, {name: entry.path})
	// 	})
	// 	.on("close", () => {
	// 		console.log("Writing lambda zip to disk");
	// 		// const lambdaZipWriteStream = fs.createWriteStream("./tmp/test.zip");
	// 		// lambdaZip.pipe(lambdaZipWriteStream);
	//
	// 		const tempLambdaZipWriteStream = fs.createWriteStream("./temp.zip");
	//
	// 		lambdaZip.pipe(tempLambdaZipWriteStream);
	// 		lambdaZip.finalize();
	//
	// 		const tempLambdaZipReadStream = fs.createReadStream("./temp.zip");
	//
	// 		lambdaZip
	// 			.pipe(unzip.Parse())
	// 			.on("entry", (entry) => {
	// 				console.log("Found file in lambda zip: ", entry.path);
	// 			});
	//
	// 	});

//});



//
//
// var params = {
//   Code: {
//     ZipFile: fs.readFileSync(__dirname + "/lambda.zip")
//   },
//   FunctionName: "TestFunction", /* required */
//   Handler: "lambda.handler", /* required */
//   Role: 'bogus-role', /* required */
//   Runtime: 'nodejs', /* required */
//   Description: 'STRING_VALUE',
//   MemorySize: 128,
//   Publish: true,
//   Timeout: 3
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



// const zipFileName = "async-test.zip";
//
// /**
//  * compileDependenciesStep
//  */
// lambda.invoke({
// 	FunctionName: "Thaumaturgy",
// 	Payload: JSON.stringify({
// 		packages: ["async"],
// 		bucket: "fam.thaumaturgy",
// 		key: zipFileName
// 	})
// }, (error, data) => {
// 	console.log("finished building dependencies on Thaumaturgy lambda");
// 	const request = s3.getObject({
// 		Bucket: "fam.thaumaturgy",
// 		Key: zipFileName
// 	});
//
// 	const dependenciesFileName = `./tmp/${zipFileName}`;
//
// 	const dependencyZipStream = request.createReadStream();
//
// 	/**
// 	 * compileLambdaZipStep
// 	 *
// 	 * input: dependencyZipStream
// 	 */
//
// 	console.log("finished getting dependency zip buffer from S3");
//
// 	const writeStream = fs.createWriteStream(dependenciesFileName);
//
// 	dependencyZipStream.pipe(writeStream);
//
// 	writeStream.on("finish", () => {
//
// 		const lambdaZipFilename = "./tmp/lambda.zip";
// 		const lambdaZip = archiver('zip', {});
// 		const lambdaZipWriteStream = fs.createWriteStream(lambdaZipFilename);
//
// 		lambdaZip.pipe(lambdaZipWriteStream);
//
// 		const lambdaFilename = "./scratch/lambda.js";
//
// 		lambdaZip.append(fs.createReadStream(lambdaFilename), {name: "lambda.js"});
//
// 		console.log("adding dependency files from buffer to dependency zip");
//
// 		fs.createReadStream(dependenciesFileName)
// 			.pipe(unzip.Parse())
// 			.on("entry", (entry) => {
// 				console.log(`adding entry: ${entry.path}`);
// 				lambdaZip.append(entry, {name: entry.path});
// 		  }).on("close", () => {
// 				console.log("finished unzipping dependency zip")
// 				lambdaZip.finalize();
// 				lambdaZipWriteStream.on("close", () => {
// 					console.log("finished zipping lambda zip");
//
// 					/**
// 					 * upsertLambdaStep
// 					 *
// 					 * input: lambdaZipStream
// 					 */
//
// 					fs.readFile(lambdaZipFilename, (error, data) => {
// 						console.log("lambda zip file read into buffer");
//
// 						var params = {
// 							Code: {
// 								ZipFile: data
// 							},
// 							FunctionName: "TestFunction", /* required */
// 							Handler: "lambda.handler", /* required */
// 							Role: 'arn:aws:iam::166191841105:role/AWSLambda', /* required */
// 							Runtime: 'nodejs', /* required */
// 							MemorySize: 128,
// 							Publish: true,
// 							Timeout: 60
// 						};
//
// 						// lambda.createFunction(params, function(err, data) {
// 						// 	console.log("Lambda deployed");
// 						// 	if (err) console.log(err, err.stack); // an error occurred
// 						// 	else     console.log(data);           // successful response
// 						// });
// 					});
// 				});
// 			});
// 	});
// });
