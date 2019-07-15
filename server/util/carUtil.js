/* eslint-disable no-plusplus */
import cloudinary from 'cloudinary';
import ApiError from '../error/ApiError';
import ErrorDetail from '../error/ErrorDetail';

cloudinary.v2.config({
  cloud_name: 'automart-api',
  api_key: '168729795321398',
  api_secret: 'dRX06FUg-zSy36Flbv9qixJ_AdQ',
});

export default class AuthUtil {
  static validatePropsCreateCar(obj, props) {
    const errors = [];
    props.forEach((property) => {
      if (!obj[property] || obj[property].trim() === '') {
        errors.push(new ErrorDetail('body', property, `${property} is required`, obj[property]));
      }
    });
    if (errors.length > 0) {
      throw new ApiError(400, 'Bad Request', errors);
    }
  }

  static fileUploadPromises(files, filekeys) {
    const promises = [];
    for (let i = 0; i < filekeys.length; i++) {
      if (files[filekeys[i]]) {
        const promise = cloudinary.v2.uploader.upload(files[filekeys[i]].path, { folder: `${filekeys[i]}/`, use_filename: true, unique_filename: false });
        promises.push(promise);
      }
    }
    // if (promises.length < 1 || promises.length > 3) {
    //   throw new ApiError(400, 'Bad Request', [new ErrorDetail('body', null, 'Photos must be between 1 & 3', null)]);
    // }
    return promises;
  }
}
