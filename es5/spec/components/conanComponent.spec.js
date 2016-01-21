"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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
	    name = undefined,
	    age = undefined,
	    initializeSpy = undefined;

	var MyComponent = (function (_ConanComponent) {
		_inherits(MyComponent, _ConanComponent);

		function MyComponent() {
			_classCallCheck(this, MyComponent);

			_get(Object.getPrototypeOf(MyComponent.prototype), "constructor", this).apply(this, arguments);
		}

		_createClass(MyComponent, [{
			key: "initialize",
			value: function initialize(newName, newAge) {
				initializeSpy(newName, newAge);
			}
		}]);

		return MyComponent;
	})(_libComponentsConanComponentJs2["default"]);

	beforeEach(function () {
		initializeSpy = _sinon2["default"].spy();
		name = "Bob Belcher";
		age = 44;
		component = new MyComponent(name, age);
	});

	it("should stub .initialize", function () {
		var BlankComponent = (function (_ConanComponent2) {
			_inherits(BlankComponent, _ConanComponent2);

			function BlankComponent() {
				_classCallCheck(this, BlankComponent);

				_get(Object.getPrototypeOf(BlankComponent.prototype), "constructor", this).apply(this, arguments);
			}

			return BlankComponent;
		})(_libComponentsConanComponentJs2["default"]);

		component = new BlankComponent();
		(typeof component.initialize).should.eql("function");
	});

	it("should call .initialize with all constructor parameters", function () {
		initializeSpy.calledWith(name, age).should.be["true"];
	});

	describe(".parameters([...newParameters])", function () {
		it("should create a getter and setter function for each new parameter", function () {
			component.parameters("name", "age");

			component.name(name);
			component.age(age);

			(component.name() === name && component.age() === age).should.be["true"];
		});
		it("should create a getter and setter function for each new parameter", function () {
			component.parameters("name", "age");

			component.name(name);
			component.age(age);

			component.parameters().should.eql({
				name: name,
				age: age
			});
		});
	});

	describe(".multipleValueParameters(...parameterNames)", function () {
		it("should create a getter and setter function for each new parameter with multiple arguments", function () {
			var valueOne = "SomeValue";
			var valueTwo = "AnotherValue";

			component.multipleValueParameters("handler");
			component.handler(valueOne, valueTwo);
			component.handler().should.eql([valueOne, valueTwo]);
		});
	});

	describe(".aggregateValueParameters(...parameterNames)", function () {
		var valueOne = undefined;
		var valueTwo = undefined;
		var valueThree = undefined;

		beforeEach(function () {
			valueOne = "SomeValue";
			valueTwo = "AnotherValue";
			valueThree = "YetAnotherValue";

			component.aggregateValueParameters("something");
			component.something(valueOne);
			component.something(valueTwo, valueThree);
		});
		it("should create a getter and setter function for each new parameter with aggregate values", function () {
			component.something().should.eql([valueOne, valueTwo, valueThree]);
		});
	});

	describe(".multipleValueAggregateParameters(...parameterNames)", function () {
		it("should create a getter and setter function for each new parameter with multiple arguments", function () {
			var valueOne = "SomeValue";
			var valueTwo = "AnotherValue";
			var valueThree = "SomeValueAgain";
			var valueFour = "AnotherValueAgain";

			component.multipleValueAggregateParameters("handler");
			component.handler(valueOne, valueTwo);
			component.handler(valueThree, valueFour);
			component.handler().should.eql([[valueOne, valueTwo], [valueThree, valueFour]]);
		});

		it("should initialize with an empty array as the value", function () {
			component.multipleValueAggregateParameters("handler");
			component.handler().should.eql([]);
		});
	});
});