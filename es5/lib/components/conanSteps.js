"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConanSteps = function () {
	function ConanSteps(parent) {
		_classCallCheck(this, ConanSteps);

		var _ = (0, _incognito2.default)(this);
		_.libraries = {};
		_.parent = parent;
		_.steps = [];
	}

	_createClass(ConanSteps, [{
		key: "add",
		value: function add(conanStep, parameters) {
			return require("./conanSteps/conanSteps.add.js").call(this, conanStep, parameters);
		}
	}, {
		key: "before",
		value: function before(existingStep, beforeStep, parameters) {
			return require("./conanSteps/conanSteps.before.js").call(this, existingStep, beforeStep, parameters);
		}
	}, {
		key: "after",
		value: function after(existingStep, afterStep, parameters) {
			return require("./conanSteps/conanSteps.after.js").call(this, existingStep, afterStep, parameters);
		}
	}, {
		key: "start",
		value: function start(callback) {
			return require("./conanSteps/conanSteps.start.js").call(this, callback);
		}
	}, {
		key: "findByName",
		value: function findByName(stepName) {
			return require("./conanSteps/conanSteps.findByName.js").call(this, stepName);
		}
	}, {
		key: "library",
		value: function library(name, value) {
			return require("./conanSteps/conanSteps.library.js").call(this, name, value);
		}
	}, {
		key: "parent",
		get: function get() {
			return (0, _incognito2.default)(this).parent;
		}
	}, {
		key: "all",
		get: function get() {
			return require("./conanSteps/conanSteps.all.js").call(this);
		}
	}]);

	return ConanSteps;
}();

exports.default = ConanSteps;