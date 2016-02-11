"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conanComponent = require("../../../components/conanComponent.js");

var _conanComponent2 = _interopRequireDefault(_conanComponent);

var _findLambdaByNameStep = require("../steps/findLambdaByNameStep.js");

var _findLambdaByNameStep2 = _interopRequireDefault(_findLambdaByNameStep);

var _findRoleByNameStep = require("../steps/findRoleByNameStep.js");

var _findRoleByNameStep2 = _interopRequireDefault(_findRoleByNameStep);

var _createRoleStep = require("../steps/createRoleStep.js");

var _createRoleStep2 = _interopRequireDefault(_createRoleStep);

var _attachRolePolicyStep = require("../steps/attachRolePolicyStep.js");

var _attachRolePolicyStep2 = _interopRequireDefault(_attachRolePolicyStep);

var _buildPackageStep = require("../steps/buildPackageStep.js");

var _buildPackageStep2 = _interopRequireDefault(_buildPackageStep);

var _compileLambdaZipStep = require("../steps/compileLambdaZipStep.js");

var _compileLambdaZipStep2 = _interopRequireDefault(_compileLambdaZipStep);

var _upsertLambdaStep = require("../steps/upsertLambdaStep.js");

var _upsertLambdaStep2 = _interopRequireDefault(_upsertLambdaStep);

var _publishLambdaVersionStep = require("../steps/publishLambdaVersionStep.js");

var _publishLambdaVersionStep2 = _interopRequireDefault(_publishLambdaVersionStep);

var _findLambdaAliasStep = require("../steps/findLambdaAliasStep.js");

var _findLambdaAliasStep2 = _interopRequireDefault(_findLambdaAliasStep);

var _createLambdaAliasStep = require("../steps/createLambdaAliasStep.js");

var _createLambdaAliasStep2 = _interopRequireDefault(_createLambdaAliasStep);

var _updateLambdaAliasStep = require("../steps/updateLambdaAliasStep.js");

var _updateLambdaAliasStep2 = _interopRequireDefault(_updateLambdaAliasStep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConanAwsLambda = function (_ConanComponent) {
	_inherits(ConanAwsLambda, _ConanComponent);

	function ConanAwsLambda() {
		_classCallCheck(this, ConanAwsLambda);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(ConanAwsLambda).apply(this, arguments));
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
			this.conan.steps.add(_findLambdaByNameStep2.default, this);
			this.conan.steps.add(_findRoleByNameStep2.default, this);
			this.conan.steps.add(_createRoleStep2.default, this);
			this.conan.steps.add(_attachRolePolicyStep2.default, this);
			this.conan.steps.add(_buildPackageStep2.default, this);
			this.conan.steps.add(_compileLambdaZipStep2.default, this);
			this.conan.steps.add(_upsertLambdaStep2.default, this);
			this.conan.steps.add(_publishLambdaVersionStep2.default, this);
			this.conan.steps.add(_findLambdaAliasStep2.default, this);
			this.conan.steps.add(_createLambdaAliasStep2.default, this);
			this.conan.steps.add(_updateLambdaAliasStep2.default, this);
		}
	}, {
		key: "lambda",
		value: function lambda(name) {
			return new ConanAwsLambda(this.conan, name);
		}
	}]);

	return ConanAwsLambda;
}(_conanComponent2.default);

exports.default = ConanAwsLambda;