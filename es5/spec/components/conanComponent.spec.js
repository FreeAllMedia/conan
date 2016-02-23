"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conanComponent = require("../../lib/components/conanComponent.js");

var _conanComponent2 = _interopRequireDefault(_conanComponent);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

describe("ConanComponent()", function () {
	var conanComponent = undefined,
	    name = undefined,
	    age = undefined,
	    initializeSpy = undefined;

	var MyComponent = function (_ConanComponent) {
		_inherits(MyComponent, _ConanComponent);

		function MyComponent() {
			_classCallCheck(this, MyComponent);

			return _possibleConstructorReturn(this, Object.getPrototypeOf(MyComponent).apply(this, arguments));
		}

		_createClass(MyComponent, [{
			key: "initialize",
			value: function initialize(newName, newAge) {
				initializeSpy(newName, newAge);
			}
		}]);

		return MyComponent;
	}(_conanComponent2.default);

	beforeEach(function () {
		initializeSpy = _sinon2.default.spy();
		name = "Bob Belcher";
		age = 44;
		conanComponent = new MyComponent(name, age);
	});

	it("should stub .initialize", function () {
		var BlankComponent = function (_ConanComponent2) {
			_inherits(BlankComponent, _ConanComponent2);

			function BlankComponent() {
				_classCallCheck(this, BlankComponent);

				return _possibleConstructorReturn(this, Object.getPrototypeOf(BlankComponent).apply(this, arguments));
			}

			return BlankComponent;
		}(_conanComponent2.default);

		conanComponent = new BlankComponent();
		_typeof(conanComponent.initialize).should.eql("function");
	});

	it("should call .initialize with all constructor parameters", function () {
		initializeSpy.calledWith(name, age).should.be.true;
	});

	describe(".parameters([...newParameters])", function () {
		it("should create a getter and setter function for each new parameter", function () {
			conanComponent.parameters("name", "age");

			conanComponent.name(name);
			conanComponent.age(age);

			(conanComponent.name() === name && conanComponent.age() === age).should.be.true;
		});
		it("should create a getter and setter function for each new parameter", function () {
			conanComponent.parameters("name", "age");

			conanComponent.name(name);
			conanComponent.age(age);

			conanComponent.parameters().should.eql({
				name: name,
				age: age
			});
		});
	});

	describe(".multipleValueParameters(...parameterNames)", function () {
		it("should create a getter and setter function for each new parameter with multiple arguments", function () {
			var valueOne = "SomeValue";
			var valueTwo = "AnotherValue";

			conanComponent.multipleValueParameters("handler");
			conanComponent.handler(valueOne, valueTwo);
			conanComponent.handler().should.eql([valueOne, valueTwo]);
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

			conanComponent.aggregateValueParameters("something");
			conanComponent.something(valueOne);
			conanComponent.something(valueTwo, valueThree);
		});
		it("should create a getter and setter function for each new parameter with aggregate values", function () {
			conanComponent.something().should.eql([valueOne, valueTwo, valueThree]);
		});
	});

	describe(".multipleValueAggregateParameters(...parameterNames)", function () {
		it("should create a getter and setter function for each new parameter with multiple arguments", function () {
			var valueOne = "SomeValue";
			var valueTwo = "AnotherValue";
			var valueThree = "SomeValueAgain";
			var valueFour = "AnotherValueAgain";

			conanComponent.multipleValueAggregateParameters("handler");
			conanComponent.handler(valueOne, valueTwo);
			conanComponent.handler(valueThree, valueFour);
			conanComponent.handler().should.eql([[valueOne, valueTwo], [valueThree, valueFour]]);
		});

		it("should initialize with an empty array as the value", function () {
			conanComponent.multipleValueAggregateParameters("handler");
			conanComponent.handler().should.eql([]);
		});
	});
});