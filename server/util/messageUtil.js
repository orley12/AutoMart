/**
 * @class MessageUtil
 * @description Handles all the messages sent to client
 * @exports MessageUtil
 */

class MessageUtil {
  /**
    * @method signupMessage
    * @description sends an email notification to the specified email upon signup
    * @param {object} data - The email address, subject & body
    * @returns {object} - The email address, subject & body
    */
  static resetPassword(user, token) {
    const { email, firstname, lastname } = user;
    const subject = 'Auto-Mart Mail';
    const body = `<p>
    Dear <em style="text-transform: capitalize">${firstname} ${lastname}</em>, <br>
  
   <p>Click <a href="inite-garden-51728.herokuapp.com/api/v1/auth/${email}/resetPassword?token=${token}"> Here!</a> to reset your password</p>
   <br>
   <p>Cheers!</p>
  
   <span>Auto-Mart</span><br>
    <span>copyright &copy; 2019</span>
   </p>`;
    return { subject, email, body };
  }

  static resetSuccess(user) {
    const { email, firstname, lastname } = user;
    const subject = 'Auto-Mart Mail';
    const body = `<p>
    Dear <em style="text-transform: capitalize">${firstname} ${lastname}</em>, <br>
  
   <p>Your password as been successfully reset</p>
   <br>
   <p>Cheers!</p>
  
   <span>Auto-Mart</span><br>
    <span>copyright &copy; 2019</span>
   </p>`;
    return { subject, email, body };
  }
}

export default MessageUtil;
