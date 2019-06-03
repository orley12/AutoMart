import express from 'express';
import cloudinary from 'cloudinary';
import multipart from 'connect-multiparty';
import dotenv from 'dotenv';
import User from '../repository/auth';
import Car from '../repository/vehicle';
// import config from '../config/tokenConfig';
import vehicleMiddleWare from '../middleware/vehicle';

const router = express.Router();
const multipartMiddleware = multipart();
dotenv.config();

cloudinary.v2.config({
  cloud_name: 'automart-api',
  api_key: '168729795321398',
  api_secret: 'dRX06FUg-zSy36Flbv9qixJ_AdQ',
});

router.post('/', [vehicleMiddleWare.loggedIn, multipartMiddleware], (req, res, next) => {
  const userId = JSON.parse(req.decoded.id);

  const data = JSON.parse(req.body.data);
  console.log(data.manufacturer);
  const user = User.findById(userId);
  if (data.price
      && data.state
      && data.manufacturer
      && data.model
      && data.body_type) {
    const filekeys = Object.keys(req.files);
    const promises = [];
    for (let i = 0; i < filekeys.length; i++) {
      if (req.files[filekeys[i]]) {
        console.log(req.files[filekeys[i]].path);
        const promise = cloudinary.v2.uploader.upload(
          req.files[filekeys[i]].path,
          {
            folder: `${filekeys[i]}/`,
            use_filename: true,
            unique_filename: false,
          },
        );

        promises.push(promise);
      }
    }
    if (promises.length < 1 || promises.length > 3) {
      const err = new Error('Photos most be between 1 & 3');
      err.status = 400;
      next(err);
    }
    Promise.all(promises).then((files) => {
      const vehicleData = {
        owner: user.id, // user id
        email: user.email,
        created_on: Date.now(),
        state: data.state, // new,used
        price: data.price,
        manufacturer: data.manufacturer,
        model: data.model,
        body_type: data.body_type, // car, truck, trailer, van, etc
        transmission: data.transmission,
        milage: data.milage,
        year: data.year,
      };
      const car = Car.save(vehicleData, files);
      res.json({
        status: 201,
        message: `${car.manufacturer} ${car.model} Created`,
        data: {
          id: car.id,
          email: user.email,
          created_on: car.created_on,
          manufacturer: car.manufacturer,
          model: car.model,
          price: car.price,
          state: car.state,
          status: car.status,
          body_type: car.body_type, // car, truck, trailer, van, etc
          transnmission: car.transmission,
          milage: car.milage,
          year: car.year,
          exterior_img: car.exterior_img,
          interior_img: car.interior_img,
          engine_img: car.engine_img,
        },
      });
    }).catch((error) => {
      console.log(error);
      const err = new Error('Unable to upload Photos');
      err.status = 408;
      next(err);
    });
  } else {
    const err = new Error('Please ensure the price state status model and body types fields are filled');
    err.status = 400;
    next(err);
  }
});

module.exports = router;
