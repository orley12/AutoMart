"use strict";

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _authRoutes = _interopRequireDefault(require("./routes/authRoutes"));

var _carRoutes = _interopRequireDefault(require("./routes/carRoutes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable no-unused-vars */
var app = (0, _express["default"])();
app.use((0, _morgan["default"])('dev'));
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: false
})); // app.get('/', (req, res, next) => {
//   res.send('hello world');
// });

app.use('/api/v1/auth', _authRoutes["default"]);
app.use('/api/v1/car', _carRoutes["default"]);
app.use(function (req, res, next) {
  var err = new Error('Resource Not Found');
  err.status = 404;
  next(err);
});
app.use(function (err, req, res, next) {
  res.json({
    status: err.status || 500,
    message: err.message,
    errors: err.errors
  });
});
var port = process.env.PORT || 3000; // eslint-disable-next-line no-console

app.listen(port, function () {
  return console.log("server running on port ".concat(port));
});
module.exports = app;