"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ApiError = _interopRequireDefault(require("../error/ApiError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AuthMiddleware =
/*#__PURE__*/
function () {
  function AuthMiddleware() {
    _classCallCheck(this, AuthMiddleware);
  }

  _createClass(AuthMiddleware, null, [{
    key: "loggedIn",
    // eslint-disable-next-line consistent-return
    value: function loggedIn(req, res, next) {
      try {
        var token = req.headers['x-access-token'];

        if (token) {
          throw new _ApiError["default"](403, 'Forbidden', ['You are already logged in']);
        }

        next();
      } catch (error) {
        next(error);
      }
    } // static validateParams(req, res, next) {
    //   try {
    //     const errors = GeneralValidators.validateProps(req.body, 'userName', 'password');
    //     if (errors.length > 0) {
    //       throw new ApiError('Incomplete request params', errors, 400);
    //     }
    //     next();
    //   } catch (error) {
    //     RespondEx.error(error, res);
    //   }
    // }
    // static validateToken(req, res, next) {
    //   try {
    //     if (req.headers.authorization.indexOf('Bearer ') < 0) {
    //       throw new Error();
    //     }
    //     const token = req.headers.authorization.replace('Bearer ', '');
    //     req.userData = jwt.verify(token, config.SECRET);
    //     next();
    //   } catch (error) {
    //     error.code = 401;
    //     error.message = 'Authorization failed.';
    //     error.possibleCauses = [
    //       'You may not be signed in',
    //     ];
    //     RespondEx.error(error, res);
    //   }
    // }
    // static async validateAdmin(req, res, next) {
    //   try {
    //     const user = await UserService.getUserByUserNameOrEmail(req.userData.email);
    //     Helpers.nullUser(user);
    //     Helpers.checkAdmin(user);
    //     next();
    //   } catch (error) {
    //     RespondEx.error(error, res);
    //   }
    // }

  }]);

  return AuthMiddleware;
}();

exports["default"] = AuthMiddleware;