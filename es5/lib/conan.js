"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _conanContextJs = require("./conanContext.js");

var _conanContextJs2 = _interopRequireDefault(_conanContextJs);

var _conanStepsJs = require("./conanSteps.js");

var _conanStepsJs2 = _interopRequireDefault(_conanStepsJs);

/**
 * @class Conan
 */

var Conan = (function () {
	/**
  * @constructor
  * @method constructor
  * @return {undefined} Nothing is returned.
  */

	function Conan(config) {
		_classCallCheck(this, Conan);

		this.config = config || {};
		this.context = new _conanContextJs2["default"]();
		this.steps = new _conanStepsJs2["default"]();
		this.plugins = [];
	}

	_createClass(Conan, [{
		key: "use",
		value: function use(ConanPlugin) {
			return require("./conan/conan.use.js").call(this, ConanPlugin);
		}
	}, {
		key: "deploy",
		value: function deploy(callback) {
			this.steps.start(callback);
		}
	}, {
		key: "version",
		get: function get() {
			return require("./conan/conan.version.js").call(this);
		}
	}]);

	return Conan;
})();

exports["default"] = Conan;
module.exports = exports["default"];