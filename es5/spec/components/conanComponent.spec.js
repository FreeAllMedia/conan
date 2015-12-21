"use strict";

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _libComponentsConanComponentJs = require("../../lib/components/conanComponent.js");

var _libComponentsConanComponentJs2 = _interopRequireDefault(_libComponentsConanComponentJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

describe("ConanComponent()", function () {
	var component = undefined,
	    parameters = undefined;

	var MyComponent = (function (_ConanComponent) {
		_inherits(MyComponent, _ConanComponent);

		function MyComponent() {
			_classCallCheck(this, MyComponent);

			_get(Object.getPrototypeOf(MyComponent.prototype), "constructor", this).apply(this, arguments);
		}

		return MyComponent;
	})(_libComponentsConanComponentJs2["default"]);

	beforeEach(function () {
		MyComponent.prototype.initialize = _sinon2["default"].spy();
	});

	describe("(with parameters provided)", function () {
		beforeEach(function () {
			parameters = {
				some: "parameter"
			};

			component = new MyComponent(parameters);
		});

		it("should set .parameters to the supplied parameters", function () {
			component.parameters.should.eql(parameters);
		});

		it("should call .initialize with all constructor parameters", function () {
			component.initialize.calledWith(parameters).should.be["true"];
		});
	});

	describe("(without parameters provided)", function () {
		beforeEach(function () {
			parameters = {
				some: "parameter"
			};

			component = new MyComponent();
		});

		it("should set component.parameters to an empty object", function () {
			component.parameters.should.eql({});
		});
	});
});