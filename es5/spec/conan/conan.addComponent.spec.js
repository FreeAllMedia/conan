"use strict";

var _conan3 = require("../../lib/conan.js");

var _conan4 = _interopRequireDefault(_conan3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe("conan.addComponent(componentName, ComponentConstructor)", function () {
	var ServerComponent = function ServerComponent() {
		_classCallCheck(this, ServerComponent);

		for (var _len = arguments.length, parameters = Array(_len), _key = 0; _key < _len; _key++) {
			parameters[_key] = arguments[_key];
		}

		this.parameters = parameters;
	};

	var conan = undefined;

	beforeEach(function () {
		conan = new _conan4.default();
		conan.addComponent("server", ServerComponent);
	});

	it("should pass conan as the first parameter to the component constructor", function () {
		var _conan;

		var parameters = [1, 2, 3];
		var server = (_conan = conan).server.apply(_conan, parameters);
		server.parameters[0].should.eql(conan);
	});

	it("should pass the parameters to the component constructor", function () {
		var _conan2;

		var parameters = [1, 2, 3];
		var server = (_conan2 = conan).server.apply(_conan2, parameters);
		parameters.unshift(conan);
		server.parameters.should.eql(parameters);
	});

	it("should return a new instance of component each time it is called", function () {
		var server = conan.server("127.0.0.1");
		server.should.be.instanceOf(ServerComponent);
	});

	it("should add the component instance to .components[componentName]", function () {
		var server = conan.server("127.0.0.1");
		conan.components.server[0].should.eql(server);
	});

	it("should add the component instance to .components[all]", function () {
		var server = conan.server("127.0.0.1");
		conan.components.all[0].should.eql(server);
	});
});