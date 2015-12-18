"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var ConanSteps = (function () {
	function ConanSteps() {
		_classCallCheck(this, ConanSteps);

		(0, _incognito2["default"])(this).steps = [];
	}

	_createClass(ConanSteps, [{
		key: "add",
		value: function add(conanStep) {
			return require("./conanSteps/conanSteps.add.js").call(this, conanStep);
		}
	}, {
		key: "before",
		value: function before(existingStep, beforeStep) {
			return require("./conanSteps/conanSteps.before.js").call(this, existingStep, beforeStep);
		}
	}, {
		key: "after",
		value: function after(existingStep, afterStep) {
			return require("./conanSteps/conanSteps.after.js").call(this, existingStep, afterStep);
		}
	}, {
		key: "start",
		value: function start(callback) {
			return require("./conanSteps/conanSteps.start.js").call(this, callback);
		}
	}, {
		key: "all",
		get: function get() {
			return require("./conanSteps/conanSteps.all.js").call(this);
		}
	}]);

	return ConanSteps;
})();

exports["default"] = ConanSteps;
module.exports = exports["default"];