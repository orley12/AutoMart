export default class AuthUtil {
  static validatePropsSignUp(obj) {
    const props = ['email', 'firstName', 'lastName', 'phone', 'address', 'password', 'confirmPassword'];
    const errors = [];
    props.forEach((property) => {
      if (!obj[property] || obj[property].trim() === '') {
        errors.push(`${property} not provided`);
      }
    });

    return errors;
  }

  static validatePropsSignIn(obj) {
    const props = ['email', 'password'];
    const errors = [];
    props.forEach((property) => {
      if (!obj[property] || obj[property].trim() === '') {
        errors.push(`${property} not provided`);
      }
    });

    return errors;
  }
}
