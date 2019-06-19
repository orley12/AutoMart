import ApiError from '../error/ApiError';

export default class AuthMiddleware {
  // eslint-disable-next-line consistent-return
  static loggedIn(req, res, next) {
    try {
      const token = req.headers['x-access-token'];
      if (token) {
        throw new ApiError(403, 'Forbidden', ['You are already logged in']);
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}
