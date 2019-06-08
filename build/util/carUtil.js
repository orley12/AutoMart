"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _cloudinary = _interopRequireDefault(require("cloudinary"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_cloudinary["default"].v2.config({
  cloud_name: 'automart-api',
  api_key: '168729795321398',
  api_secret: 'dRX06FUg-zSy36Flbv9qixJ_AdQ'
});

var AuthUtil =
/*#__PURE__*/
function () {
  function AuthUtil() {
    _classCallCheck(this, AuthUtil);
  }

  _createClass(AuthUtil, null, [{
    key: "validatePropsCreateCar",
    value: function validatePropsCreateCar(obj) {
      var props = ['price', 'state', 'manufacturer', 'model', 'bodyType'];
      var errors = [];
      props.forEach(function (property) {
        if (!obj[property] || obj[property].trim() === '') {
          errors.push("".concat(property, " not provided"));
        }
      });
      return errors;
    }
  }, {
    key: "fileUploadPromises",
    value: function fileUploadPromises(files, filekeys) {
      var promises = []; // eslint-disable-next-line no-plusplus

      for (var i = 0; i < filekeys.length; i++) {
        if (files[filekeys[i]]) {
          var promise = _cloudinary["default"].v2.uploader.upload(files[filekeys[i]].path, {
            folder: "".concat(filekeys[i], "/"),
            use_filename: true,
            unique_filename: false
          });

          promises.push(promise);
        }
      }

      return promises;
    }
  }]);

  return AuthUtil;
}();

exports["default"] = AuthUtil;