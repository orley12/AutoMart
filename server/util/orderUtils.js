import ApiError from '../error/ApiError';

export default class AuthUtil {
  static validatePropsOrder(obj) {
    const props = ['carId', 'price'];
    const errors = [];
    props.forEach((property) => {
      if (!obj[property] || obj[property].trim() === '') {
        errors.push(`${property} not provided`);
      }
    });
    if (errors.length > 0) {
      throw new ApiError(400, 'Bad Request', errors);
    }
  }

  static validatePropsUpdateOrder(obj) {
    const props = ['price'];
    const errors = [];
    props.forEach((property) => {
      if (!obj[property] || obj[property].trim() === '') {
        errors.push(`${property} not provided`);
      }
    });
    if (errors.length > 0) {
      throw new ApiError(400, 'Bad Request', errors);
    }
  }
}
