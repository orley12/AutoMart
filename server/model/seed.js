/* eslint-disable consistent-return */
import authRepository from '../repository/authRepository';
import db from './db';

const seedTable = () => {
  try {
    const queryUser = db.query(`
  INSERT INTO users ("firstname", "lastname", email, password, address, "isadmin") 
  VALUES ('john', 'doe', 'johndoe@gmail.com', '${authRepository.hashPassword('manjen102')}', '75 Bode Thomas Surulere', false),
  ('manny', 'jenson', 'mannyjenson@gmail.com', '${authRepository.hashPassword('manjen102')}', '75 Bode Thomas Surulere', false),
  ('sam', 'peterson', 'sam@gmail.com', '${authRepository.hashPassword('manjen102')}', '75 Bode Thomas Surulere', false); `);

    // const queryLoan = await db.query(`
    //   INSERT INTO loans ("useremail", createdon, status, repaid, tenor, amount, paymentInstallment, balance, interest)
    //     VALUES ('doniyke44@gmail.com', '${moment(new Date())}', 'approved', 'false', 12, 200000, 26666.52, 200000, 2500),
    //            ('peperenpe@gmail.com', '${moment(new Date())}', 'approved', 'true', 12, 200000, 26666.52, 0.00, 2500);`);


    console.log(queryUser /* , queryLoan */);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.stack);
    return err.stack;
  }
};

seedTable();
