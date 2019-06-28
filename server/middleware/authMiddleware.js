import ApiError from '../error/ApiError';

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

  static resetValidator(req, res, next) {
    if (req.body.password && req.body.newPassword) {
      req.resetPath = 2;
      next();
    } else if (req.query.token && req.body.password && req.body.confirmPassword) {
      req.resetPath = 1;
      next();
    } else {
      req.resetPath = 0;
      next();
    }
  }
}
