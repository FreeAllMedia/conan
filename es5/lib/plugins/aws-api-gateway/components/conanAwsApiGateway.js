"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conanComponent = require("../../../components/conanComponent.js");

var _conanComponent2 = _interopRequireDefault(_conanComponent);

var _conanAwsApiGatewayStage = require("./conanAwsApiGatewayStage.js");

var _conanAwsApiGatewayStage2 = _interopRequireDefault(_conanAwsApiGatewayStage);

var _findApiByNameStep = require("../steps/findApiByNameStep.js");

var _findApiByNameStep2 = _interopRequireDefault(_findApiByNameStep);

var _updateApiStep = require("../steps/updateApiStep.js");

var _updateApiStep2 = _interopRequireDefault(_updateApiStep);

var _createApiStep = require("../steps/createApiStep.js");

var _createApiStep2 = _interopRequireDefault(_createApiStep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConanAwsApiGateway = function (_ConanComponent) {
	_inherits(ConanAwsApiGateway, _ConanComponent);

	function ConanAwsApiGateway() {
		_classCallCheck(this, ConanAwsApiGateway);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(ConanAwsApiGateway).apply(this, arguments));
	}

	_createClass(ConanAwsApiGateway, [{
		key: "initialize",
		value: function initialize(conan, name) {
			this.conan = conan;

			this.parameters("name");

			this.name(name);

			// find api by name
			this.conan.steps.add(_findApiByNameStep2.default, this);
			this.conan.steps.add(_updateApiStep2.default, this);
			this.conan.steps.add(_createApiStep2.default, this);
		}
	}, {
		key: "stage",
		value: function stage(name) {
			return new _conanAwsApiGatewayStage2.default(this.conan, name);
		}
	}, {
		key: "api",
		value: function api(name) {
			return new ConanAwsApiGateway(this.conan, name);
		}
	}]);

	return ConanAwsApiGateway;
}(_conanComponent2.default);

exports.default = ConanAwsApiGateway;