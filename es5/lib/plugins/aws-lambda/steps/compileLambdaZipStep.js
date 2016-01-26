"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports["default"] = compileLambdaZipStep;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _archiver = require("archiver");

var _archiver2 = _interopRequireDefault(_archiver);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _unzip2 = require("unzip2");

var _unzip22 = _interopRequireDefault(_unzip2);

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

var _hacher = require("hacher");

var _hacher2 = _interopRequireDefault(_hacher);

function buildZipPath(fullPath, basePath) {
	return fullPath.replace(_path2["default"].normalize(basePath) + "/", "");
}

function compileLambdaZipStep(conan, context, stepDone) {
	/* eslint-disable new-cap */
	var conanAwsLambda = context.parameters;

	var packageZipFilePath = context.results.packageZipFilePath;

	var handlerFilePath = conanAwsLambda.handler()[1];
	var handlerName = conanAwsLambda.handler()[0];

	//the lambda file path is another dependency
	conanAwsLambda.dependencies(conanAwsLambda.filePath());

	var lambdaZip = (0, _archiver2["default"])("zip", {});

	if (_fs2["default"].existsSync(handlerFilePath)) {
		conanAwsLambda.filePath(handlerFilePath);
		var lambdaFilePath = conanAwsLambda.filePath();
		var lambdaFileName = _path2["default"].basename(lambdaFilePath);
		var lambdaReadStream = _fs2["default"].createReadStream(lambdaFilePath);

		lambdaZip.append(lambdaReadStream, { name: lambdaFileName });
	} else {
		var lambdaFilePath = buildZipPath(conanAwsLambda.filePath(), conan.config.basePath);
		var conanHandlerContent = "module.exports = {\n\t" + handlerName + ": require(\"./" + lambdaFilePath + "\")." + handlerName + "\n};";
		var conanHandlerFileName = "conanHandler-" + _hacher2["default"].getUUID() + ".js";

		conanAwsLambda.filePath(conanHandlerFileName);
		lambdaZip.append(conanHandlerContent, { name: conanHandlerFileName });
	}

	var lambdaZipFileName = (0, _jargon2["default"])(conanAwsLambda.name()).snake.toString();
	var lambdaZipFilePath = context.temporaryDirectoryPath + "/" + lambdaZipFileName + ".zip";
	var lambdaZipWriteStream = _fs2["default"].createWriteStream(lambdaZipFilePath);

	var dependencies = conanAwsLambda.dependencies();

	_flowsync2["default"].series([appendDependencies, appendPackages], function () {
		stepDone(null, {
			lambdaZipFilePath: lambdaZipFilePath
		});
	});

	function appendDependencies(done) {
		if (dependencies.length > 0) {
			_flowsync2["default"].mapParallel(dependencies, appendDependencyGlob, done);
		} else {
			done();
		}

		function appendDependencyGlob(dependency, callback) {
			var dependencyGlob = dependency[0];
			var dependencyZipPath = dependency[1];

			(0, _glob2["default"])(dependencyGlob, function (error, filePaths) {
				filePaths.forEach(function (filePath) {
					addPathToZip(filePath, dependencyZipPath);
				});
				callback();
			});
		}
	}

	function appendPackages(done) {
		if (packageZipFilePath) {
			_fs2["default"].createReadStream(packageZipFilePath).pipe(_unzip22["default"].Parse()).on("entry", function (entry) {
				var isDirectory = entry.path.slice(-1) === "/";
				if (!isDirectory) {
					lambdaZip.append(entry, { name: "node_modules/" + entry.path });
				}
			}).on("close", function () {
				packagesAppended();
			});
		} else {
			packagesAppended();
		}

		function packagesAppended() {
			lambdaZipWriteStream.on("close", done);
			lambdaZip.pipe(lambdaZipWriteStream);
			lambdaZip.finalize();
		}
	}

	function addPathToZip(filePath, relativeZipPath) {
		var fileStats = _fs2["default"].statSync(filePath);
		var isDirectory = fileStats.isDirectory();

		var relativeFilePath = undefined;
		var finalFilePath = buildZipPath(filePath, conan.config.basePath);

		if (relativeZipPath) {
			relativeFilePath = relativeZipPath + "/" + finalFilePath;
		} else {
			relativeFilePath = finalFilePath;
		}

		if (!isDirectory) {
			var fileReadStream = _fs2["default"].createReadStream(filePath);
			lambdaZip.append(fileReadStream, { name: relativeFilePath, stats: fileStats });
		} else {
			relativeFilePath = relativeFilePath + "/";
			lambdaZip.append("", { name: relativeFilePath, stats: fileStats });
		}
	}
}

module.exports = exports["default"];