import fileSystem from "fs";
import inflect from "jargon";

export default function buildPackageStep(conan, context, stepDone) {
	const conanAwsLambda = context.parameters;

	if (conanAwsLambda.packages() !== undefined) {
		const AWS = context.libraries.AWS;

		const lambda = new AWS.Lambda({
			region: conan.config.region
		});

		const s3 = new AWS.S3({
			region: conan.config.region
		});

		const lambdaName = conanAwsLambda.name();
		const packageZipFileName = `${inflect(lambdaName).camel.toString()}.packages.zip`;

		const parameters = {
			FunctionName: "Thaumaturgy",
			InvocationType: "RequestResponse",
			LogType: "Tail",
			Payload: JSON.stringify({
				packages: context.parameters.packages(),
				bucket: conan.config.bucket,
				key: packageZipFileName
			})
		};

		lambda.invoke(parameters, (error) => {
			const packageZipReadStream = s3.getObject({
				Bucket: conan.config.bucket,
				Key: packageZipFileName
			}).createReadStream();

			const packageZipFilePath = `${context.temporaryDirectoryPath}/${packageZipFileName}`;

			const packageZipWriteStream = fileSystem.createWriteStream(packageZipFilePath);

			packageZipWriteStream.on("close", () => {
				stepDone(null, {
					packageZipFilePath: packageZipFilePath
				});
			});

			packageZipReadStream.pipe(packageZipWriteStream);
		});
	} else {
		stepDone(null, {
			packageZipFilePath: null
		});
	}
}
