"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _authUtil = _interopRequireDefault(require("../util/authUtil"));

var _ApiError = _interopRequireDefault(require("../error/ApiError"));

var _authRepository = _interopRequireDefault(require("../repository/authRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_dotenv["default"].config();

var AuthController =
/*#__PURE__*/
function () {
  function AuthController() {
    _classCallCheck(this, AuthController);
  }

  _createClass(AuthController, null, [{
    key: "signUp",
    // eslint-disable-next-line consistent-return
    value: function signUp(req, res, next) {
      try {
        var errors = _authUtil["default"].validatePropsSignUp(req.body);

        if (errors.length > 0) {
          throw new _ApiError["default"](400, 'Bad Request', errors);
        } else if (req.body.password !== req.body.confirmPassword) {
          throw new _ApiError["default"](400, 'Bad Request', ['passwords don\'t match']);
        }

        var hashedPassword = _authRepository["default"].hashPassWord(req.body.password);

        var user = _authRepository["default"].save(req.body, hashedPassword);

        var token = _jsonwebtoken["default"].sign({
          id: user.id
        }, process.env.SECRET, {
          expiresIn: '24h'
        });

        res.status(201).json({
          status: 201,
          message: "".concat(user.firstName, " ").concat(user.lastName, " Created"),
          data: {
            token: token,
            id: user.id,
            // id of newly created user
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            address: user.address
          }
        });
      } catch (error) {
        next(error);
      }
    } // eslint-disable-next-line consistent-return

  }, {
    key: "signIn",
    value: function signIn(req, res, next) {
      try {
        var errors = _authUtil["default"].validatePropsSignIn(req.body);

        if (errors.length > 0) {
          throw new _ApiError["default"](400, 'Bad Request', errors);
        } else {
          // eslint-disable-next-line consistent-return
          _authRepository["default"].authenticate(req.body.email, req.body.password, function (error, user) {
            try {
              if (error || !user) {
                throw new _ApiError["default"](401, 'Unauthorized', ['Wrong password or email']);
              }

              var token = _jsonwebtoken["default"].sign({
                id: user.id
              }, process.env.SECRET, {
                expiresIn: '24h'
              });

              res.status(200).json({
                status: 200,
                message: "Welcome ".concat(user.firstName, " ").concat(user.lastName),
                data: {
                  token: token,
                  id: user.id,
                  // user id
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email
                }
              });
            } catch (err) {
              next(err);
            }
          });
        }
      } catch (error) {
        next(error);
      }
    }
  }]);

  return AuthController;
}();

exports["default"] = AuthController;