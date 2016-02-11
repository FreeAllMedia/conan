"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = buildPackageStep;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildPackageStep(conan, context, stepDone) {
	var conanAwsLambda = context.parameters;

	if (conanAwsLambda.packages() !== undefined) {
		(function () {
			var AWS = context.libraries.AWS;

			var lambda = new AWS.Lambda({
				region: conan.config.region
			});

			var s3 = new AWS.S3({
				region: conan.config.region
			});

			var lambdaName = conanAwsLambda.name();
			var packageZipFileName = (0, _jargon2.default)(lambdaName).camel.toString() + ".packages.zip";

			var parameters = {
				FunctionName: "Thaumaturgy",
				InvocationType: "RequestResponse",
				LogType: "Tail",
				Payload: JSON.stringify({
					packages: context.parameters.packages(),
					bucket: conan.config.bucket,
					key: packageZipFileName
				})
			};

			lambda.invoke(parameters, function (error) {
				var packageZipReadStream = s3.getObject({
					Bucket: conan.config.bucket,
					Key: packageZipFileName
				}).createReadStream();

				var packageZipFilePath = context.temporaryDirectoryPath + "/" + packageZipFileName;

				var packageZipWriteStream = _fs2.default.createWriteStream(packageZipFilePath);

				packageZipWriteStream.on("close", function () {
					stepDone(null, {
						packageZipFilePath: packageZipFilePath
					});
				});

				packageZipReadStream.pipe(packageZipWriteStream);
			});
		})();
	} else {
		stepDone(null, {
			packageZipFilePath: null
		});
	}
}