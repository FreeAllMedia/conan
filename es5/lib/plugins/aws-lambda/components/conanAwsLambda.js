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

var _stepsFindRoleByNameStepJs = require("../steps/findRoleByNameStep.js");

var _stepsFindRoleByNameStepJs2 = _interopRequireDefault(_stepsFindRoleByNameStepJs);

var _stepsCreateRoleStepJs = require("../steps/createRoleStep.js");

var _stepsCreateRoleStepJs2 = _interopRequireDefault(_stepsCreateRoleStepJs);

var _stepsAttachRolePolicyStepJs = require("../steps/attachRolePolicyStep.js");

var _stepsAttachRolePolicyStepJs2 = _interopRequireDefault(_stepsAttachRolePolicyStepJs);

var _stepsBuildPackageStepJs = require("../steps/buildPackageStep.js");

var _stepsBuildPackageStepJs2 = _interopRequireDefault(_stepsBuildPackageStepJs);

var _stepsCompileLambdaZipStepJs = require("../steps/compileLambdaZipStep.js");

var _stepsCompileLambdaZipStepJs2 = _interopRequireDefault(_stepsCompileLambdaZipStepJs);

var _stepsUpsertLambdaStepJs = require("../steps/upsertLambdaStep.js");

var _stepsUpsertLambdaStepJs2 = _interopRequireDefault(_stepsUpsertLambdaStepJs);

var _stepsPublishLambdaVersionStepJs = require("../steps/publishLambdaVersionStep.js");

var _stepsPublishLambdaVersionStepJs2 = _interopRequireDefault(_stepsPublishLambdaVersionStepJs);

var _stepsFindLambdaAliasStepJs = require("../steps/findLambdaAliasStep.js");

var _stepsFindLambdaAliasStepJs2 = _interopRequireDefault(_stepsFindLambdaAliasStepJs);

var _stepsCreateLambdaAliasStepJs = require("../steps/createLambdaAliasStep.js");

var _stepsCreateLambdaAliasStepJs2 = _interopRequireDefault(_stepsCreateLambdaAliasStepJs);

var _stepsUpdateLambdaAliasStepJs = require("../steps/updateLambdaAliasStep.js");

var _stepsUpdateLambdaAliasStepJs2 = _interopRequireDefault(_stepsUpdateLambdaAliasStepJs);

var ConanAwsLambda = (function (_ConanComponent) {
	_inherits(ConanAwsLambda, _ConanComponent);

	function ConanAwsLambda() {
		_classCallCheck(this, ConanAwsLambda);

		_get(Object.getPrototypeOf(ConanAwsLambda.prototype), "constructor", this).apply(this, arguments);
	}

	_createClass(ConanAwsLambda, [{
		key: "initialize",
		value: function initialize(conan, name, filePath, role) {
			this.conan = conan;

			this.parameters("name", "filePath", "runtime", "role", "description", "memorySize", "timeout", "publish", "bucket", "packages");

			this.multipleValueParameters("handler");

			this.multipleValueAggregateParameters("dependencies", "alias");

			this.name(name);
			this.filePath(filePath);
			this.role(role);

			this.handler("handler");
			this.runtime("nodejs");
			this.memorySize(128);
			this.timeout(3);

			// attach steps to conan
			this.conan.steps.add(_stepsFindLambdaByNameStepJs2["default"], this);
			this.conan.steps.add(_stepsFindRoleByNameStepJs2["default"], this);
			this.conan.steps.add(_stepsCreateRoleStepJs2["default"], this);
			this.conan.steps.add(_stepsAttachRolePolicyStepJs2["default"], this);
			this.conan.steps.add(_stepsBuildPackageStepJs2["default"], this);
			this.conan.steps.add(_stepsCompileLambdaZipStepJs2["default"], this);
			this.conan.steps.add(_stepsUpsertLambdaStepJs2["default"], this);
			this.conan.steps.add(_stepsPublishLambdaVersionStepJs2["default"], this);
			this.conan.steps.add(_stepsFindLambdaAliasStepJs2["default"], this);
			this.conan.steps.add(_stepsCreateLambdaAliasStepJs2["default"], this);
			this.conan.steps.add(_stepsUpdateLambdaAliasStepJs2["default"], this);
		}
	}, {
		key: "lambda",
		value: function lambda(name) {
			return new ConanAwsLambda(this.conan, name);
		}
	}]);

	return ConanAwsLambda;
})(_componentsConanComponentJs2["default"]);

exports["default"] = ConanAwsLambda;
module.exports = exports["default"];