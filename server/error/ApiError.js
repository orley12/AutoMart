export default class ApiError extends Error {
  constructor(status, message, error) {
    super(message);
    this.error = error;
    this.status = status;
  }
}
