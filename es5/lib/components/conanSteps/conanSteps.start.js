"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = start;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function start(callback) {
	var _this = this;

	var _ = (0, _incognito2.default)(this);
	var accumulatedResults = {};

	_temp2.default.track();

	_temp2.default.mkdir("conanSteps", function (error, temporaryDirectoryPath) {

		_flowsync2.default.mapSeries(_.steps, function (step, done) {
			var context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				libraries: _this.libraries,
				parameters: step.parameters,
				results: Object.assign({}, accumulatedResults)
			};
			var beforeRunTime = new Date().getTime();
			// console.log(`${step.handler.name} Started`);
			step.handler(_.parent, context, function (stepError, stepResult) {
				Object.assign(accumulatedResults, stepResult);
				process.stdout.write((0, _jargon2.default)(step.handler.name).table.toString().replace(/_/g, " ").replace(" steps", "") + " - " + (new Date().getTime() - beforeRunTime) + "ms\n");
				done(stepError, stepResult);
			});
		}, function (errors) {
			_temp2.default.cleanup(function () {
				callback(errors);
			});
		});
	});
}