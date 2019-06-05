import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: 'automart-api',
  api_key: '168729795321398',
  api_secret: 'dRX06FUg-zSy36Flbv9qixJ_AdQ',
});

export default class AuthUtil {
  static validatePropsCreateCar(obj) {
    const props = ['price', 'state', 'manufacturer', 'model', 'bodyType'];
    const errors = [];
    props.forEach((property) => {
      if (!obj[property] || obj[property].trim() === '') {
        errors.push(`${property} not provided`);
      }
    });

    return errors;
  }

  static fileUploadPromises(files, filekeys) {
    const promises = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < filekeys.length; i++) {
      if (files[filekeys[i]]) {
        const promise = cloudinary.v2.uploader.upload(
          files[filekeys[i]].path,
          {
            folder: `${filekeys[i]}/`,
            use_filename: true,
            unique_filename: false,
          },
        );

        promises.push(promise);
      }
    }
    return promises;
  }
}
