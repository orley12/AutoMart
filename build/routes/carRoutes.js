"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _connectMultiparty = _interopRequireDefault(require("connect-multiparty"));

var _carMiddleware = _interopRequireDefault(require("../middleware/carMiddleware"));

var _carController = _interopRequireDefault(require("../controller/carController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// eslint-disable-next-line import/extensions
var multipartMiddleware = (0, _connectMultiparty["default"])();

var router = _express["default"].Router();

router.post('/', [multipartMiddleware, _carMiddleware["default"].canWrite], _carController["default"].createCar);
router.get('/', _carMiddleware["default"].hasToken, _carController["default"].getCars);
router.patch('/:id/status', [_carMiddleware["default"].canWrite, _carMiddleware["default"].isOwner], _carController["default"].updateCarStatus);
router.patch('/:id/price', [_carMiddleware["default"].canWrite, _carMiddleware["default"].isOwner], _carController["default"].updateCarPrice);
router.get('/:id', _carMiddleware["default"].canWrite, _carController["default"].getCar);
router["delete"]('/:id', [_carMiddleware["default"].canWrite, _carMiddleware["default"].canDelete], _carController["default"].deleteCar);
router.post('/:id/flag', _carMiddleware["default"].canWrite, _carController["default"].flag);
var _default = router;
exports["default"] = _default;