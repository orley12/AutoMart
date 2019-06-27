import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import ApiError from '../error/ApiError';
import ErrorDetail from '../error/ErrorDetail';

dotenv.config();

/**
 * @class EmailUtil
 * @description Handles all the mailing needs of the app
 * @exports EmailUtil
 */
class EmailUtil {
  /**
  * @method sendMailMethod
  * @description sends an email notification to the specified email address
  * @param {object} user - The email address, subject & body
  * @returns {*} nothing
  */
  static sendMailMethod(user) {
    const transport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.SERVER_MAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: 'automart0001@gmail.com',
      to: user.email,
      subject: user.subject,
      html: user.body,
    };
    return transport.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('message sent !');
      }
    });
  }
}

export default EmailUtil;
