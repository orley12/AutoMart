"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _carUtil = _interopRequireDefault(require("../util/carUtil"));

var _ApiError = _interopRequireDefault(require("../error/ApiError"));

var _carRepository = _interopRequireDefault(require("../repository/carRepository"));

var _authRepository = _interopRequireDefault(require("../repository/authRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CarController =
/*#__PURE__*/
function () {
  function CarController() {
    _classCallCheck(this, CarController);
  }

  _createClass(CarController, null, [{
    key: "createCar",
    // eslint-disable-next-line consistent-return
    value: function createCar(req, res, next) {
      var userId = JSON.parse(req.decoded.id);

      try {
        var carData = JSON.parse(req.body.data);

        var errors = _carUtil["default"].validatePropsCreateCar(carData);

        if (errors.length > 0) {
          throw new _ApiError["default"](400, 'Bad Request', errors);
        }

        var filekeys = Object.keys(req.files);

        var filePromises = _carUtil["default"].fileUploadPromises(req.files, filekeys);

        if (filePromises.length < 1 || filePromises.length > 3) {
          throw new _ApiError["default"](400, 'Bad Request', ['Photos most be between 1 & 3']);
        }

        Promise.all(filePromises).then(function (files) {
          var user = _authRepository["default"].findById(userId);

          var car = _carRepository["default"].save(user, carData, files);

          res.status(201).json({
            status: 201,
            message: "".concat(car.manufacturer, " ").concat(car.model, " Created"),
            data: {
              id: car.id,
              email: car.ownerEmail,
              created_on: car.created_on,
              manufacturer: car.manufacturer,
              model: car.model,
              price: car.price,
              state: car.state,
              status: car.status,
              bodyType: car.bodyType,
              // car, truck, trailer, van, etc
              transnmission: car.transmission,
              milage: car.milage,
              year: car.year,
              exteriorImg: car.exteriorImg,
              interiorImg: car.interiorImg,
              engineImg: car.engineImg
            }
          }); // eslint-disable-next-line no-unused-vars
        })["catch"](function (error) {
          next(new _ApiError["default"](408, 'Request Timeout', 'Unable to upload Photos'));
        });
      } catch (error) {
        next(error);
      }
    }
  }, {
    key: "getCars",
    value: function getCars(req, res) {
      var cars = [];

      if (req.decoded.id) {
        var userId = JSON.parse(req.decoded.id);

        var user = _authRepository["default"].findById(userId);

        if (user.is_admin === true) {
          cars = _carRepository["default"].findAll();
        }
      } else {
        cars = _carRepository["default"].findAllUnsold();
      }

      if (req.query.manufacturer) {
        cars = cars.filter(function (car) {
          console.log("".concat(req.query.manufacturer, "  ").concat(car.manufacturer));
          return req.query.manufacturer.toLowerCase() === car.manufacturer.toLowerCase();
        });
      }

      if (req.query.state) {
        cars = cars.filter(function (car) {
          console.log("".concat(req.query.state.toLowerCase(), "  ").concat(car.state.toLowerCase()));
          return req.query.state.toLowerCase() === car.state.toLowerCase();
        });
      }

      if (req.query.bodyType) {
        cars = cars.filter(function (car) {
          console.log("".concat(req.query.bodyType.toLowerCase(), "  ").concat(car.bodyType.toLowerCase()));
          return req.query.bodyType.toLowerCase() === car.bodyType.toLowerCase();
        });
      }

      if (req.query.minPrice && req.query.maxPrice) {
        cars = cars.filter(function (car) {
          console.log("".concat(req.query.min_price, "  ").concat(req.query.max_price)); // eslint-disable-next-line max-len

          return Number(car.price) >= Number(req.query.min_price) && Number(car.price) <= Number(req.query.max_price);
        });
      }

      res.json({
        status: 200,
        message: 'success',
        data: cars
      });
    }
  }, {
    key: "updateCarStatus",
    value: function updateCarStatus(req, res, next) {
      if (req.body.status) {
        if (req.body.status.toLowerCase() === 'sold' || req.body.status.toLowerCase() === 'unsold') {
          var updatedCar = _carRepository["default"].update(req.params.id, req.body.status, null
          /* price */
          );

          res.json({
            status: 200,
            message: "".concat(updatedCar.manufacturer, " ").concat(updatedCar.model, " Updated"),
            data: {
              id: updatedCar.id,
              email: updatedCar.email,
              createdOn: updatedCar.createdOn,
              manufacturer: updatedCar.manufacturer,
              model: updatedCar.model,
              price: updatedCar.price,
              state: updatedCar.state,
              status: updatedCar.status
            }
          });
        } else {
          next(new _ApiError["default"](400, 'Bad Request', ['Invalid status']));
        }
      } else {
        next(new _ApiError["default"](400, 'Bad Request', ['No status provided']));
      }
    }
  }, {
    key: "updateCarPrice",
    value: function updateCarPrice(req, res, next) {
      if (req.body.price) {
        console.log(_typeof(Number(req.body.price)));

        if (typeof Number(req.body.price) === 'number' || req.body.price !== '') {
          var updatedCar = _carRepository["default"].update(req.params.id, null, req.body.price);

          res.status(200).json({
            status: 200,
            message: "".concat(updatedCar.manufacturer, " ").concat(updatedCar.model, " Updated"),
            data: {
              id: updatedCar.id,
              email: updatedCar.email,
              createdOn: updatedCar.createdOn,
              manufacturer: updatedCar.manufacturer,
              model: updatedCar.model,
              price: updatedCar.price,
              state: updatedCar.state,
              status: updatedCar.status
            }
          });
        } else {
          next(new _ApiError["default"](400, 'Bad Request', ['Invalid price']));
        }
      } else {
        next(new _ApiError["default"](400, 'Bad Request', ['No price provided']));
      }
    }
  }, {
    key: "getCar",
    value: function getCar(req, res, next) {
      var car = _carRepository["default"].findById(Number(req.params.id));

      if (car) {
        res.status(200).json({
          status: 200,
          data: {
            id: car.id,
            owner: car.owner,
            created_on: car.created_on,
            state: car.state,
            status: car.status,
            price: car.price,
            manufacturer: car.manufacturer,
            model: car.model,
            bodyType: car.bodyType
          }
        });
      } else {
        next(new _ApiError["default"](400, 'Not Found', ['The car is not in our database']));
      }
    }
  }, {
    key: "deleteCar",
    value: function deleteCar(req, res, next) {
      var deletedCar = _carRepository["default"]["delete"](Number(req.params.id));

      if (deletedCar === true) {
        res.status(200).json({
          status: 200,
          message: 'Request Successful',
          data: 'Car Ad successfully deleted'
        });
      } else if (deletedCar === null) {
        next(new _ApiError["default"](404, 'Not Found', ['The car is not in our database']));
      } else {
        next(new _ApiError["default"](403, 'Bad Request', ['Unable to delete AD']));
      }
    }
  }, {
    key: "flag",
    value: function flag(req, res, next) {
      if (req.body.reason) {
        var user = _authRepository["default"].findById(Number(req.decoded.id));

        var car = _carRepository["default"].findById(Number(req.params.id));

        var flag = _carRepository["default"].saveFlag(user.id, car.id, req.body);

        res.status(200).json({
          status: 200,
          message: 'Car flaged',
          data: {
            id: flag.id,
            carId: flag.carId,
            reason: flag.reason,
            description: flag.description
          }
        });
      } else {
        next(new _ApiError["default"](400, 'Bad Request', ['Request not success']));
      }
    }
  }]);

  return CarController;
}();

exports["default"] = CarController;