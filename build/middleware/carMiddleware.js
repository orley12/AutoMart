"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _ApiError = _interopRequireDefault(require("../error/ApiError"));

var _carRepository = _interopRequireDefault(require("../repository/carRepository"));

var _authRepository = _interopRequireDefault(require("../repository/authRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

_dotenv["default"].config();

var CarMiddleware =
/*#__PURE__*/
function () {
  function CarMiddleware() {
    _classCallCheck(this, CarMiddleware);
  }

  _createClass(CarMiddleware, null, [{
    key: "canWrite",
    // eslint-disable-next-line consistent-return
    value: function canWrite(req, res, next) {
      var token = req.headers['x-access-token'];

      try {
        if (!token) {
          throw new _ApiError["default"](400, 'Bad Request', ['No token was provided']);
        }

        _jsonwebtoken["default"].verify(token, process.env.SECRET, function (error, decoded) {
          try {
            if (error) {
              throw new _ApiError["default"](401, 'Unauthorized', ['Failed to authenticate token']);
            }

            req.decoded = decoded;
            next();
          } catch (err) {
            next(err);
          }
        });
      } catch (error) {
        next(error);
      }
    }
  }, {
    key: "hasToken",
    value: function hasToken(req, res, next) {
      var token = req.headers['x-access-token'];

      try {
        if (!token) {
          next();
        }

        _jsonwebtoken["default"].verify(token, process.env.SECRET, function (error, decoded) {
          try {
            if (error) {
              next();
            }

            req.decoded = decoded;
            next();
          } catch (err) {
            next(err);
          }
        });
      } catch (error) {
        next(error);
      }
    }
  }, {
    key: "isOwner",
    value: function isOwner(req, res, next) {
      var userId = JSON.parse(req.decoded.id);

      var car = _carRepository["default"].findById(Number(req.params.id));

      try {
        if (userId !== car.owner) {
          throw new _ApiError["default"](401, 'Unauthorizied', ['You do not have permission to perform this action']);
        }

        next();
      } catch (error) {
        next(error);
      }
    }
  }, {
    key: "canDelete",
    value: function canDelete(req, res, next) {
      var userId = JSON.parse(req.decoded.id);

      var user = _authRepository["default"].findById(Number(req.params.id));

      var car = _carRepository["default"].findById(Number(req.params.id));

      if (car !== undefined) {
        try {
          if (userId !== car.owner || user.isAdmin === false) {
            throw new _ApiError["default"](401, 'Unauthorizied', ['You do not have permission to perform this action']);
          }

          next();
        } catch (error) {
          next(error);
        }
      }
    }
  }]);

  return CarMiddleware;
}();

exports["default"] = CarMiddleware;