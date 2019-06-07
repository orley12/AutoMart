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

  // static validateParams(req, res, next) {
  //   try {
  //     const errors = GeneralValidators.validateProps(req.body, 'userName', 'password');
  //     if (errors.length > 0) {
  //       throw new ApiError('Incomplete request params', errors, 400);
  //     }

  //     next();
  //   } catch (error) {
  //     RespondEx.error(error, res);
  //   }
  // }

  // static validateToken(req, res, next) {
  //   try {
  //     if (req.headers.authorization.indexOf('Bearer ') < 0) {
  //       throw new Error();
  //     }

  //     const token = req.headers.authorization.replace('Bearer ', '');
  //     req.userData = jwt.verify(token, config.SECRET);

  //     next();
  //   } catch (error) {
  //     error.code = 401;
  //     error.message = 'Authorization failed.';
  //     error.possibleCauses = [
  //       'You may not be signed in',
  //     ];
  //     RespondEx.error(error, res);
  //   }
  // }

  // static async validateAdmin(req, res, next) {
  //   try {
  //     const user = await UserService.getUserByUserNameOrEmail(req.userData.email);

  //     Helpers.nullUser(user);
  //     Helpers.checkAdmin(user);

  //     next();
  //   } catch (error) {
  //     RespondEx.error(error, res);
  //   }
  // }
}
