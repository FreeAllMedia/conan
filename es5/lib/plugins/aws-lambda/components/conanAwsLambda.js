"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _componentsConanComponentJs = require("../../../components/conanComponent.js");

var _componentsConanComponentJs2 = _interopRequireDefault(_componentsConanComponentJs);

var _stepsFindLambdaByNameStepJs = require("../steps/findLambdaByNameStep.js");

var _stepsFindLambdaByNameStepJs2 = _interopRequireDefault(_stepsFindLambdaByNameStepJs);

var _stepsUpsertLambdaByNameStepJs = require("../steps/upsertLambdaByNameStep.js");

var _stepsUpsertLambdaByNameStepJs2 = _interopRequireDefault(_stepsUpsertLambdaByNameStepJs);

var _stepsCompileDependenciesStepJs = require("../steps/compileDependenciesStep.js");

var _stepsCompileDependenciesStepJs2 = _interopRequireDefault(_stepsCompileDependenciesStepJs);

var ConanAwsLambda = (function (_ConanComponent) {
	_inherits(ConanAwsLambda, _ConanComponent);

	function ConanAwsLambda() {
		_classCallCheck(this, ConanAwsLambda);

		_get(Object.getPrototypeOf(ConanAwsLambda.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(ConanAwsLambda, [{
		key: "initialize",
		value: function initialize(conan, name, filePath, handler) {
			this.conan = conan;

			this.parameters("name", "filePath", "handler", "runtime", "role", "description", "memorySize", "timeout", "publish");

			this.name(name);
			this.filePath(filePath);
			this.handler(handler);

			// attach steps to conan
			var parameters = this.parameters();

			// thaumaturgy compilation, download and extraction
			this.conan.steps.add(_stepsCompileDependenciesStepJs2["default"], parameters);
			// tmp folder build with necessary code & zip creation
			// upload zip to s3
			// find lambda
			this.conan.steps.add(_stepsFindLambdaByNameStepJs2["default"], parameters);
			// create/update lambda
			this.conan.steps.add(_stepsUpsertLambdaByNameStepJs2["default"], parameters);
		}
	}]);

	return ConanAwsLambda;
})(_componentsConanComponentJs2["default"]);

exports["default"] = ConanAwsLambda;
module.exports = exports["default"];