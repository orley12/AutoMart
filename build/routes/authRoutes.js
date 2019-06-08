"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _authMiddleware = _interopRequireDefault(require("../middleware/authMiddleware"));

var _authController = _interopRequireDefault(require("../controller/authController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// eslint-disable-next-line import/extensions
var router = _express["default"].Router();

router.post('/signup', _authMiddleware["default"].loggedIn, _authController["default"].signUp);
router.post('/signin', _authMiddleware["default"].loggedIn, _authController["default"].signIn);
var _default = router;
exports["default"] = _default;