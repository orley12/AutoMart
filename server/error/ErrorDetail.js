export default class ApiError extends Error {
  constructor(location, param, message, value) {
    super();
    this.location = location;
    this.param = param;
    this.msg = message;
    this.value = value;
  }
}
