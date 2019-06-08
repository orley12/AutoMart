"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable no-param-reassign */
var cars = new Map();
var flags = new Map();

var CarRepository =
/*#__PURE__*/
function () {
  function CarRepository() {
    _classCallCheck(this, CarRepository);
  }

  _createClass(CarRepository, null, [{
    key: "save",
    value: function save(owner, car, files) {
      car.id = cars.size;
      car.status = 'unsold'; // sold,available - default is available

      car.owner = owner.id;
      car.ownerEmail = owner.email;
      car.createdOn = Date.now(); // eslint-disable-next-line no-plusplus

      for (var i = 0; i < files.length; i++) {
        if (files[i].public_id.includes('exterior')) {
          car.exteriorImg = files[i].secure_url;
        } else if (files[i].public_id.includes('interior')) {
          car.interiorImg = files[i].secure_url;
        } else if (files[i].public_id.includes('engine')) {
          car.engineImg = files[i].secure_url;
        }
      }

      cars.set(car.id, car);
      return cars.get(car.id);
    }
  }, {
    key: "findAll",
    value: function findAll() {
      var allCars = []; // eslint-disable-next-line no-unused-vars

      cars.forEach(function (value, key) {
        allCars.push(value);
      });
      return allCars;
    }
  }, {
    key: "findAllUnsold",
    value: function findAllUnsold() {
      var allUnsoldCars = []; // eslint-disable-next-line no-unused-vars

      cars.forEach(function (value, key) {
        if (value.status === 'unsold') {
          allUnsoldCars.push(value);
        }
      });
      return allUnsoldCars;
    }
  }, {
    key: "findById",
    value: function findById(id) {
      return cars.get(id);
    }
  }, {
    key: "update",
    value: function update(carId, status, price) {
      var car = cars.get(Number(carId));

      if (price === null) {
        car.status = status;
      } else if (status === null) {
        car.price = price;
      }

      car.updatedOn = Date.now();
      cars.set(car.id, car);
      return car;
    }
  }, {
    key: "delete",
    value: function _delete(id) {
      if (!cars.has(id)) {
        return null;
      }

      return cars["delete"](id);
    }
  }, {
    key: "saveFlag",
    value: function saveFlag(userId, carId, flag) {
      flag.owner = userId;
      flag.carId = carId;
      flag.createdOn = Date.now();
      flag.id = flags.size;
      flags.set(flag.id, flag);
      return flags.get(flag.id);
    }
  }]);

  return CarRepository;
}();

exports["default"] = CarRepository;