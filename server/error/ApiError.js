export default class ApiError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.errors = errors;
    this.status = status;
  }
}
