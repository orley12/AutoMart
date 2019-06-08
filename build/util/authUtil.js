"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AuthUtil =
/*#__PURE__*/
function () {
  function AuthUtil() {
    _classCallCheck(this, AuthUtil);
  }

  _createClass(AuthUtil, null, [{
    key: "validatePropsSignUp",
    value: function validatePropsSignUp(obj) {
      var props = ['email', 'firstName', 'lastName', 'phone', 'address', 'password', 'confirmPassword'];
      var errors = [];
      props.forEach(function (property) {
        if (!obj[property] || obj[property].trim() === '') {
          errors.push("".concat(property, " not provided"));
        }
      });
      return errors;
    }
  }, {
    key: "validatePropsSignIn",
    value: function validatePropsSignIn(obj) {
      var props = ['email', 'password'];
      var errors = [];
      props.forEach(function (property) {
        if (!obj[property] || obj[property].trim() === '') {
          errors.push("".concat(property, " not provided"));
        }
      });
      return errors;
    }
  }]);

  return AuthUtil;
}();

exports["default"] = AuthUtil;