"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var users = new Map();

var AuthRepository =
/*#__PURE__*/
function () {
  function AuthRepository() {
    _classCallCheck(this, AuthRepository);
  }

  _createClass(AuthRepository, null, [{
    key: "hashPassWord",
    value: function hashPassWord(password) {
      return _bcrypt["default"].hashSync(password, 10);
    } // eslint-disable-next-line class-methods-use-this

  }, {
    key: "findByEmail",
    value: function findByEmail(email) {
      var user = {}; // eslint-disable-next-line no-unused-vars

      users.forEach(function (value) {
        if (value.email.toLowerCase() === email.toLowerCase()) {
          user = value;
        }
      });
      return user;
    }
  }, {
    key: "authenticate",
    value: function authenticate(email, password, callback) {
      var user = this.findByEmail(email); // console.log(user);

      if (!user) {
        return callback(new Error('user not found'));
      }

      _bcrypt["default"].compare(password, user.password, function (error, result) {
        if (result === true) {
          return callback(null, user);
        }

        return callback();
      });
    }
  }, {
    key: "save",
    value: function save(user, hashPassWord) {
      user.password = hashPassWord;
      user.id = users.size;
      user.isAdmin = false;
      users.set(user.id, user);
      return user;
    }
  }, {
    key: "findById",
    value: function findById(id) {
      return users.get(id);
    }
  }]);

  return AuthRepository;
}();

exports["default"] = AuthRepository;