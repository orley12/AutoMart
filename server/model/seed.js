/* eslint-disable consistent-return */
import authUtil from '../util/authUtil';
import db from './db';

const seedTable = async () => {
  try {
    const queryUser = await db.query(`
  INSERT INTO users (first_name, last_name, email, password, phone, address) 
  VALUES ('john', 'doe', 'johndoe@gmail.com', '${authUtil.hashPassWord('password')}', '090888777665', '75 Bode Thomas Surulere'),
  ('manny', 'jenson', 'mannyjenson@gmail.com', '${authUtil.hashPassWord('password')}', '090888777665', '75 Bode Thomas Surulere'),
  ('sam', 'peterson', 'sam@gmail.com', '${authUtil.hashPassWord('password')}','090888777665', '75 Bode Thomas Surulere'); `);

    const queryCar = await db.query(`
    INSERT INTO cars (state, price, manufacturer, model,
      body_type, transmission, milage, year, exterior_img, owner, location)
      VALUES ('new', '750000', 'Benz', 'SLS', 'coupe', 'automatic', '5000', '2020', 'https://res.cloudinary.com/automart-api/image/upload/v1561297529/exterior/HHHNT6zcV3E1_zZezHKf4gDH.png', 4, '75 Bode Thomas Surulere'),
      ('new', '750000', 'Audi', 'maybach', 'coupe', 'manual', '5000', '1889', 'https://res.cloudinary.com/automart-api/image/upload/v1561297529/exterior/HHHNT6zcV3E1_zZezHKf4gDH.png', 3, '75 Bode Thomas Surulere');`);

    // console.log(queryUser, queryCar);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.stack);
    return err.stack;
  }
};

seedTable();
