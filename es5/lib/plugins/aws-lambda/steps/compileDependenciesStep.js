"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = compileDependenciesStep;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function compileDependenciesStep(conan, context, stepDone) {
	var AWS = context.dependencies.AWS;

	var lambda = new AWS.Lambda({
		region: conan.config.region
	});

	var s3 = new AWS.S3({
		region: conan.config.region
	});

	var parameters = {
		FunctionName: "Thaumaturgy",
		InvocationType: "RequestResponse",
		LogType: "Tail",
		Payload: JSON.stringify({
			packages: context.parameters.packages(),
			bucket: context.parameters.bucket(),
			key: context.parameters.key()
		})
	};

	lambda.invoke(parameters, function (error, data) {
		var dependencyZipReadStream = s3.getObject({
			Bucket: context.parameters.bucket(),
			Key: context.parameters.key()
		}).createReadStream();

		var dependencyZipFileName = context.parameters.key();
		var dependencyZipFilePath = context.temporaryDirectoryPath + "/" + dependencyZipFileName;
		var dependencyZipWriteStream = _fs2["default"].createWriteStream(dependencyZipFilePath);

		dependencyZipWriteStream.on("close", function () {
			stepDone(null, {
				dependencyZipFilePath: dependencyZipFilePath
			});
		});

		dependencyZipReadStream.pipe(dependencyZipWriteStream);
	});
}

module.exports = exports["default"];