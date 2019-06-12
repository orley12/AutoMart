/* eslint-disable no-unused-expressions */
// Require the dev-dependencies
import chai from 'chai';
import fs from 'fs';
import chaiHttp from 'chai-http';
import app from '../server/app';

// eslint-disable-next-line no-unused-vars
const should = chai.should();
const { expect } = chai;
chai.use(chaiHttp);


describe('ORDER ROUTES TEST', () => {
  const requester = chai.request(app).keepOpen();
  describe('/POST ORDER', () => {
    // let token = '';
    // before((done) => {
    //   requester.post('/api/v1/auth/signup')
    //     .send({
    //       firstName: 'Ola',
    //       lastName: 'Ola',
    //       email: 'sole@yahoo.com',
    //       phone: '09049908094',
    //       password: 'hashedPassword',
    //       confirmPassword: 'hashedPassword',
    //       address: 'akmodojojfoj',
    //     }).end((err, res) => {
    //       res.body.should.have.property('status').eql(201);
    //       res.body.should.have.property('data');
    //       res.body.data.should.be.a('object');
    //       res.body.data.should.have.property('id');
    //       res.body.data.should.have.property('firstName');
    //       res.body.data.should.have.property('lastName');
    //       res.body.data.should.have.property('email');
    //       res.body.data.should.have.property('address');
    //       // eslint-disable-next-line prefer-destructuring
    //       token = res.body.data.token;
    //       console.log(`${token} HERE`);
    //       done();
    //     });
    // });

    // it('should correctly return a car data if it was created successful', (done) => {
    //   console.log(token);
    //   requester.post('/api/v1/car')
    //     .set('x-access-token', token)
    //     .attach('exterior', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
    //     // .attach('interior', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
    //     // .attach('engine', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
    //     .field('data', JSON.stringify({
    //       manufacturer: 'aston-martin', model: 'stallion', price: '750000', state: 'new', bodyType: 'sedan', transnmission: 'automatic', milage: '5000', year: '2018', exteriorImg: 'car.exterior_img', interiorImg: 'car.interior_img', engineImg: 'car.engine_img',
    //     }))
    //     .end((err, res) => {
    //       res.body.should.have.property('status').eql(201);
    //       res.body.should.have.property('data');
    //       res.body.should.have.property('message');
    //       res.body.data.should.be.a('object');
    //       res.body.data.should.have.property('id');
    //       res.body.data.should.have.property('email');
    //       res.body.data.should.have.property('manufacturer');
    //       res.body.data.should.have.property('price');
    //       res.body.data.should.have.property('state');
    //       res.body.data.should.have.property('status');
    //       res.body.data.should.have.property('bodyType');
    //       res.body.data.should.have.property('milage');
    //       res.body.data.should.have.property('year');
    //       res.body.data.should.have.property('exteriorImg');
    //       res.body.data.should.have.property('interiorImg');
    //       res.body.data.should.have.property('engineImg');
    //       done();
    //     });
    // });

    // it('should correctly return a order data if order was successful', (done) => {
    //   requester.post('/api/v1/order')
    //     .set('x-access-token', token)
    //     .send({
    //       carId: '0',
    //       offeredPrice: '400000',
    //     }).end((err, res) => {
    //       res.body.should.have.property('status').eql(201);
    //       res.body.should.have.property('data');
    //       res.body.data.should.be.a('object');
    //       res.body.data.should.have.property('id');
    //       res.body.data.should.have.property('carId');
    //       res.body.data.should.have.property('createdOn');
    //       res.body.data.should.have.property('status');
    //       res.body.data.should.have.property('offeredPrice');
    //       done();
    //     });
    // });

    // it('should return status 400 and error, if carId or offerPrice is not provided', (done) => {
    //   requester.post('/api/v1/order')
    //     .set('x-access-token', token)
    //     .send({
    //       offeredPrice: '400000',
    //     }).end((err, res) => {
    //       res.body.should.have.property('status').eql(400);
    //       res.body.should.have.property('message');
    //       res.body.should.have.property('errors');
    //       done();
    //     });
    // });

    // it('should return status 404 and error, if car specified is not found', (done) => {
    //   requester.post('/api/v1/order')
    //     .set('x-access-token', token)
    //     .send({
    //       carId: '10',
    //       offeredPrice: '400000',
    //     }).end((err, res) => {
    //       res.body.should.have.property('status').eql(404);
    //       res.body.should.have.property('message');
    //       res.body.should.have.property('errors');
    //       done();
    //     });
    // });
  });/* STOP */

  describe('/POST ORDER MODIFICATION', () => {
    let token = '';
    let orderId = '';
    let savedCarId = '';
    before((done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          firstName: 'Ola',
          lastName: 'Ola',
          email: 'sole@yahoo.com',
          phone: '09049908094',
          password: 'hashedPassword',
          confirmPassword: 'hashedPassword',
          address: 'akmodojojfoj',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(201);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('firstName');
          res.body.data.should.have.property('lastName');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('address');
          // eslint-disable-next-line prefer-destructuring
          token = res.body.data.token;
          console.log(`${token} HERE`);
          done();
        });
    });

    it('should correctly return a car data if it was created successful', (done) => {
      console.log(token);
      requester.post('/api/v1/car')
        .set('x-access-token', token)
        .attach('exterior', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
        // .attach('interior', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
        // .attach('engine', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
        .field('data', JSON.stringify({
          manufacturer: 'aston-martin', model: 'stallion', price: '750000', state: 'new', bodyType: 'sedan', transnmission: 'automatic', milage: '5000', year: '2018', exteriorImg: 'car.exterior_img', interiorImg: 'car.interior_img', engineImg: 'car.engine_img',
        }))
        .end((err, res) => {
          res.body.should.have.property('status').eql(201);
          res.body.should.have.property('data');
          res.body.should.have.property('message');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('manufacturer');
          res.body.data.should.have.property('price');
          res.body.data.should.have.property('state');
          res.body.data.should.have.property('status');
          res.body.data.should.have.property('bodyType');
          res.body.data.should.have.property('milage');
          res.body.data.should.have.property('year');
          res.body.data.should.have.property('exteriorImg');
          res.body.data.should.have.property('interiorImg');
          res.body.data.should.have.property('engineImg');
          savedCarId = res.body.data.id;
          console.log(typeof(savedCarId));
          done();
        });
    });

    it('should correctly return a order data if order was successful', (done) => {
      requester.post('/api/v1/order')
        .set('x-access-token', token)
        .send({
          carId: '0',
          offeredPrice: '400000',
        }).end((err, res) => {
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('carId');
          res.body.data.should.have.property('createdOn');
          res.body.data.should.have.property('status');
          res.body.data.should.have.property('offeredPrice');
          orderId = Number(res.body.data.id);
          console.log(res.body.data);
          done();
        });
    });

    it('should return status 200 if order is successfully modified', (done) => {
      requester.patch(`/api/v1/order/${orderId}/price`)
        .set('x-access-token', token)
        .send({
          offeredPrice: '400000',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('carId');
          res.body.data.should.have.property('status');
          res.body.data.should.have.property('oldOfferedPrice');
          res.body.data.should.have.property('newOfferedPrice');
          done();
        });
    });

    it('should return status 400 and error, if offeredPrice is not provided', (done) => {
      requester.patch(`/api/v1/order/${orderId}/price`)
        .set('x-access-token', token)
        .send({
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('errors');
          res.body.should.have.property('message');
          done();
        });
    });
  });/* STOP */
});
