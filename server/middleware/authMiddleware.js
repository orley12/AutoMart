import jwt from 'jsonwebtoken';
import ApiError from '../error/ApiError';
import ErrorDetail from '../error/ErrorDetail';
import AuthRepository from '../repository/authRepository';

export default class AuthMiddleware {
  static validateSignUpProps(req, res, next) {
    req.check('email')
      .notEmpty()
      .withMessage('Email field is required')
      .trim()
      .isEmail()
      .withMessage('Invalid Email Address Entered!')
      .customSanitizer(email => email.toLowerCase());

    req
      .checkBody('firstName')
      .notEmpty()
      .withMessage('First name field is required')
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage('First name should be between 3 to 15 characters')
      .isAlpha()
      .withMessage('First name should only contain alphabets')
      .customSanitizer(firstName => firstName.toLowerCase());

    req
      .checkBody('lastName')
      .notEmpty()
      .withMessage('Last name field is required')
      .trim()
      .isLength({ min: 3, max: 15 })
      .withMessage('Last name should be between 3 to 15 characters')
      .isAlpha()
      .withMessage('Last name should only contain alphabets')
      .customSanitizer(lastName => lastName.toLowerCase());

    req
      .checkBody('password')
      .notEmpty()
      .withMessage('Password field is required')
      .trim()
      .isLength({ min: 6, max: 40 })
      .withMessage('Password should be between 6 to 15 characters');

    req
      .checkBody('confirmPassword')
      .notEmpty()
      .withMessage('Password field is required')
      .trim()
      .equals(req.body.password)
      .withMessage('Passwords dont match');

    req
      .checkBody('phone')
      .notEmpty()
      .isInt()
      .withMessage('Phone number should only contain numbers')
      .trim()
      .isLength({ min: 6, max: 15 })
      .withMessage('Password should be between 6 to 15 characters');

    req
      .checkBody('address')
      .notEmpty()
      .withMessage('Address field is required')
      .trim()
      .isLength({ min: 10, max: 50 })
      .withMessage('Address should be between 10 to 50 characters')
      .matches(/^[A-Za-z0-9\.\-\s\,]*$/)
      .withMessage('Invalid Address format entered');
    const errors = req.validationErrors();
    if (errors) {
      next(new ApiError(400, 'Bad Request', errors));
    }
    next();
    return null;
  }

  static validateSignInProps(req, res, next) {
    req
      .checkBody('email')
      .notEmpty()
      .withMessage('Email field is required')
      .trim()
      .isEmail()
      .withMessage('Invalid Email Address Entered!')
      .customSanitizer(email => email.toLowerCase());

    req
      .checkBody('password')
      .notEmpty()
      .withMessage('Password field is required');
    const errors = req.validationErrors();
    if (errors) {
      next(new ApiError(400, 'Bad Request', errors));
    }
    next();
  }

  static loggedIn(req, res, next) {
    req
      .checkHeaders('x-access-token')
      .isEmpty()
      .withMessage('You are already logged in');
    const errors = req.validationErrors();
    if (errors) {
      next(new ApiError(400, 'Bad Request', errors));
    }
    next();
  }

  static resetMapper(req, res, next) {
    if (req.body.password && req.body.newPassword) {
      req.resetPath = 2;
      next();
    } else if (req.query.token && req.body.password && req.body.confirmPassword) {
      req.resetPath = 1;
      next();
    } else if (!req.query.token
      && !req.body.password
      && !req.body.confirmPassword
      && !req.body.newPassword) {
      req.resetPath = 0;
      next();
    } else {
      req.resetPath = null;
      next();
    }
  }

  static canWrite(req, res, next) {
    const token = req.headers['x-access-token'];
    try {
      if (!token) {
        throw new ApiError(400, 'Bad Request',
          [new ErrorDetail('headers', 'x-access-token', 'No token was provided', null)]);
      }
      jwt.verify(token, process.env.SECRET, (error, decoded) => {
        try {
          if (error) {
            throw new ApiError(401, 'Unauthorized',
              [new ErrorDetail('headers', 'x-access-token', 'Failed to authenticate token', token)]);
          }
          req.decoded = decoded;
          next();
        } catch (err) {
          next(err);
        }
      });
    } catch (error) {
      next(error);
    }
  }


  static async isAdmin(req, res, next) {
    try {
      req.isAdmin = false;
      if (req.decoded) {
        const { rows } = await AuthRepository.findById(req.decoded.id);
        if (rows.length > 0) {
          // console.log(rows[0].is_admin);
          if (rows[0].is_admin === true) {
            req.isAdmin = true;
            next();
          } else {
            throw new ApiError(401, 'Unauthorizied',
              [new ErrorDetail('Headers', 'userId', 'You do not have permission to perform this action', req.decoded.id)]);
          }
        }
      } else {
        throw new ApiError(400, 'Bad Request',
          [new ErrorDetail('headers', 'x-access-token', 'No token was provided', null)]);
      }
    } catch (error) {
      next(error);
    }
  }

  static async canDelete(req, res, next) {
    try {
    //   // next();
      const userId = JSON.parse(req.decoded.id);

      const { rows: userRows } = await AuthRepository.findById(Number(userId));
      if (userRows.length < 1) {
        throw new ApiError(404, 'Not Found',
          [new ErrorDetail('Headers', 'x-access-token', 'User is not in our database', req.decoded.id)]);
      }

      if (userId === userRows[0].id || userRows[0].is_admin === true) {
        next();
      } else {
        throw new ApiError(401, 'Unauthorizied',
          [new ErrorDetail('Headers', 'userId', 'You do not have permission to perform this action', req.decoded.id)]);
      }
    } catch (error) {
      next(error);
    }
  }
}
