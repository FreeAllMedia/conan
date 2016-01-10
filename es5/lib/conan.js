"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _componentsConanStepsJs = require("./components/conanSteps.js");

var _componentsConanStepsJs2 = _interopRequireDefault(_componentsConanStepsJs);

var _componentsConanComponentJs = require("./components/conanComponent.js");

var _componentsConanComponentJs2 = _interopRequireDefault(_componentsConanComponentJs);

/**
 * @class Conan
 */

var Conan = (function () {
  /**
   * @constructor
   * @method constructor
   * @param {Object} config A configuration object that is saved to `conan.config`. There are no options by default, but plugins can add many of them.
   * @return {Conan} An instantiated copy of Conan
   */

  function Conan(config) {
    _classCallCheck(this, Conan);

    this.config = config || {};
    this.steps = new _componentsConanStepsJs2["default"](this);
    this.plugins = [];
  }

  _createClass(Conan, [{
    key: "use",
    value: function use(ConanPlugin) {
      this.plugins.push(new ConanPlugin(this));
    }
  }, {
    key: "deploy",
    value: function deploy(callback) {
      this.steps.start(callback);
    }
  }, {
    key: "version",
    get: function get() {
      return require("../../package.json").version;
    }
  }]);

  return Conan;
})();

exports["default"] = Conan;
exports.ConanComponent = _componentsConanComponentJs2["default"];