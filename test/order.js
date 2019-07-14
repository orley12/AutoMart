/* eslint-disable no-unused-expressions */
// Require the dev-dependencies
import chai from 'chai';
import fs from 'fs';
import chaiHttp from 'chai-http';
import app from '../server/app';

// eslint-disable-next-line no-unused-vars
const should = chai.should();
chai.use(chaiHttp);


describe('ORDER ROUTES TEST', () => {
  const requester = chai.request(app).keepOpen();
  describe('/POST ORDER', () => {
    let token = '';
    before((done) => {
      requester.post('/api/v1/auth/signin')
        .send({
          email: 'sole@yahoo.com',
          password: 'hashedPassword',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('token');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('first_name');
          res.body.data.should.have.property('last_name');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('phone');
          res.body.data.should.have.property('address');
          // eslint-disable-next-line prefer-destructuring
          token = res.body.data.token;
          done();
        });
    });

    it('should correctly return a order data if order was successful', (done) => {
      requester.post('/api/v1/order')
        .set('x-access-token', token)
        .send({
          carId: '1',
          price: '400000',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(201);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('car_id');
          res.body.data.should.have.property('created_on');
          res.body.data.should.have.property('buyer');
          // res.body.data.should.have.property('originalPrice');
          // res.body.data.should.have.property('status');
          // res.body.data.should.have.property('amount');
          done();
        });
    });

    it('should return status 400 and error, if carId is not provided', (done) => {
      requester.post('/api/v1/order')
        .set('x-access-token', token)
        .send({
          price: '400000',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return status 400 and error, if offerPrice is not provided', (done) => {
      requester.post('/api/v1/order')
        .set('x-access-token', token)
        .send({
          carId: '2',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return status 400 and error, if carId is not valid', (done) => {
      requester.post('/api/v1/order')
        .set('x-access-token', token)
        .send({
          carId: '2a',
          price: '400000',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return status 400 and error, if offeredPrice is not valid', (done) => {
      requester.post('/api/v1/order')
        .set('x-access-token', token)
        .send({
          carId: '1',
          price: '400000a',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return status 404 and error, if car specified is not found', (done) => {
      requester.post('/api/v1/order')
        .set('x-access-token', token)
        .send({
          carId: '100',
          price: '400000',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(404);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });
  });/* STOP */

  describe('/GET SINGLE ORDER ', () => {
    let token = '';
    let anotherToken = '';
    let orderId = '';

    before((done) => {
      requester.post('/api/v1/auth/signin')
        .send({
          email: 'sole@yahoo.com',
          password: 'hashedPassword',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('token');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('first_name');
          res.body.data.should.have.property('last_name');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('phone');
          res.body.data.should.have.property('address');
          // eslint-disable-next-line prefer-destructuring
          token = res.body.data.token;
        });

      requester.post('/api/v1/auth/signin')
        .send({
          email: 'sam@gmail.com',
          password: 'password',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('token');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('first_name');
          res.body.data.should.have.property('last_name');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('phone');
          res.body.data.should.have.property('address');
          // eslint-disable-next-line prefer-destructuring
          anotherToken = res.body.data.token;
          done();
        });
    });

    it('should correctly return a order data if order was successful', (done) => {
      requester.post('/api/v1/order')
        .set('x-access-token', token)
        .send({
          carId: '1',
          price: '400000',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(201);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('car_id');
          res.body.data.should.have.property('created_on');
          res.body.data.should.have.property('buyer');
          orderId = res.body.data.id;
          done();
        });
    });

    it('should return status 200 and order if request is successful', (done) => {
      requester.get(`/api/v1/order/${orderId}`)
        .set('x-access-token', token)
        .send({})
        .end((err, res) => {
          res.body.should.have.property('data');
          res.body.should.have.property('status').eql(200);
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('created_on');
          res.body.data.should.have.property('amount');
          res.body.data.should.have.property('status');
          res.body.data.should.have.property('original_price');
          res.body.data.should.have.property('buyer');
          res.body.data.should.have.property('car_id');
          done();
        });
    });

    it('should return status 404 and error, if order is not found', (done) => {
      requester.get('/api/v1/order/101')
        .set('x-access-token', token)
        .send().end((err, res) => {
          res.body.should.have.property('status').eql(404);
          res.body.should.have.property('errors');
          res.body.should.have.property('message');
          done();
        });
    });

    it('should return status 401 error if non owner tries to access the order', (done) => {
      requester.get(`/api/v1/order/${orderId}`)
        .set('x-access-token', anotherToken)
        .end((err, res) => {
          res.body.should.have.property('status').eql(401);
          res.body.should.have.property('errors');
          res.body.should.have.property('message');
          done();
        });
    });

    it('should return status 400 error if not token is provived', (done) => {
      requester.get(`/api/v1/order/${orderId}`)
        .end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('errors');
          res.body.should.have.property('message');
          done();
        });
    });

    it('should return status 400 error if token is invalid', (done) => {
      requester.get(`/api/v1/order/${orderId}`)
        .set('x-access-token', 1234567890)
        .end((err, res) => {
          res.body.should.have.property('status').eql(401);
          res.body.should.have.property('errors');
          res.body.should.have.property('message');
          done();
        });
    });
  });/* STOP */

  describe('/POST ORDER MODIFICATION', () => {
    let token = '';
    before((done) => {
      requester.post('/api/v1/auth/signin')
        .send({
          email: 'sole@yahoo.com',
          password: 'hashedPassword',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('token');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('first_name');
          res.body.data.should.have.property('last_name');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('phone');
          res.body.data.should.have.property('address');
          // eslint-disable-next-line prefer-destructuring
          token = res.body.data.token;
          done();
        });
    });

    it('should return status 200 if order is successfully modified', (done) => {
      requester.patch('/api/v1/order/1/price')
        .set('x-access-token', token)
        .send({
          price: '400000',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('car_id');
          res.body.data.should.have.property('created_on');
          res.body.data.should.have.property('buyer');
          res.body.data.should.have.property('status');
          // res.body.data.should.have.property('oldPrice');
          // res.body.data.should.have.property('newPrice');
          done();
        });
    });

    it('should return status 400 and error, if offeredPrice is not provided', (done) => {
      requester.patch('/api/v1/order/1/price')
        .set('x-access-token', token)
        .send().end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('errors');
          res.body.should.have.property('message');
          done();
        });
    });

    it('should return status 400 and error, if offeredPrice is not valid', (done) => {
      requester.patch('/api/v1/order/1/price')
        .set('x-access-token', token)
        .send({
          price: '400000a',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return status 400 and error, if no token is provided', (done) => {
      requester.patch('/api/v1/order/1/price')
        .send({
          price: '400000',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return status 400 and error, if order id is not found', (done) => {
      requester.patch('/api/v1/order/100/price')
        .set('x-access-token', token)
        .send({
          price: '400000',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(404);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return status 401 and error, if no token provided is in valid', (done) => {
      requester.patch('/api/v1/order/1/price')
        .set('x-access-token', 1234567890)
        .send({
          price: '400000',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(401);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });
  });/* STOP */

  describe('/GET ORDER BY OWNER', () => {
    let token = '';
    let anotherToken = '';

    before((done) => {
      requester.post('/api/v1/auth/signin')
        .send({
          email: 'sole@yahoo.com',
          password: 'hashedPassword',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('token');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('first_name');
          res.body.data.should.have.property('last_name');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('phone');
          res.body.data.should.have.property('address');
          // eslint-disable-next-line prefer-destructuring
          token = res.body.data.token;
        });

      requester.post('/api/v1/auth/signin')
        .send({
          email: 'sam@gmail.com',
          password: 'password',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('token');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('first_name');
          res.body.data.should.have.property('last_name');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('phone');
          res.body.data.should.have.property('address');
          // eslint-disable-next-line prefer-destructuring
          anotherToken = res.body.data.token;
          done();
        });
    });

    it('should return status 200 and array of order', (done) => {
      requester.get('/api/v1/order')
        .set('x-access-token', token)
        .end((err, res) => {
          // console.log(res.body.data);
          res.body.should.have.property('data');
          res.body.should.have.property('status').eql(200);
          res.body.data.should.be.a('array');
          done();
        });
    });

    it('should return status 400 and error, if no token is provided', (done) => {
      requester.get('/api/v1/order')
        .send().end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('errors');
          res.body.should.have.property('message');
          done();
        });
    });

    it('should return status 401 error if invalid token is provided', (done) => {
      requester.get('/api/v1/order')
        .set('x-access-token', '1234567890')
        .end((err, res) => {
          res.body.should.have.property('status').eql(401);
          res.body.should.have.property('errors');
          res.body.should.have.property('message');
          done();
        });
    });

    it('should return status 404 error there was no result from query', (done) => {
      requester.get('/api/v1/order')
        .set('x-access-token', anotherToken)
        .end((err, res) => {
          res.body.should.have.property('status').eql(404);
          res.body.should.have.property('errors');
          res.body.should.have.property('message');
          done();
        });
    });
  });/* STOP */

  describe('/PATCH UPDATE ORDER STATUS', () => {
    let token = '';
    let anotherToken = '';
    let orderId = '';
    let carId = '';

    before((done) => {
      requester.post('/api/v1/auth/signin')
        .send({
          email: 'sole@yahoo.com',
          password: 'hashedPassword',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('token');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('first_name');
          res.body.data.should.have.property('last_name');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('phone');
          res.body.data.should.have.property('address');
          // eslint-disable-next-line prefer-destructuring
          token = res.body.data.token;
        });

      requester.post('/api/v1/auth/signin')
        .send({
          email: 'sam@gmail.com',
          password: 'password',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('token');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('first_name');
          res.body.data.should.have.property('last_name');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('phone');
          res.body.data.should.have.property('address');
          // eslint-disable-next-line prefer-destructuring
          anotherToken = res.body.data.token;
          done();
        });
    });

    it('should correctly return a car data if it was created successful', (done) => {
      requester.post('/api/v1/car')
        .set('x-access-token', token)
        .attach('exterior', fs.readFileSync('./test/img/coupe.JPEG'), 'coupe.JPEG')
      // .attach('interior', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
      // .attach('engine', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
        .field('data', JSON.stringify({
          manufacturer: 'aston-martin', model: 'stallion', price: '750000', state: 'new', bodyType: 'sedan', transnmission: 'automatic', milage: '5000', year: '2018', exteriorImg: 'car.exterior_img', interiorImg: 'car.interior_img', engineImg: 'car.engine_img', location: '75 Bode Thomas Surulere',
        }))
        .end((err, res) => {
          res.body.should.have.property('status').eql(201);
          res.body.should.have.property('data');
          res.body.should.have.property('message');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('owner');
          res.body.data.should.have.property('manufacturer');
          res.body.data.should.have.property('price');
          res.body.data.should.have.property('state');
          res.body.data.should.have.property('status');
          res.body.data.should.have.property('body_type');
          res.body.data.should.have.property('milage');
          res.body.data.should.have.property('year');
          res.body.data.should.have.property('exterior_img');
          res.body.data.should.have.property('interior_img');
          res.body.data.should.have.property('engine_img');
          res.body.data.should.have.property('created_on');
          res.body.data.should.have.property('model');
          res.body.data.should.have.property('transmission');
          carId = Number(res.body.data.id);
          done();
        });
    });

    it('should correctly return a order data if order was successful', (done) => {
      requester.post('/api/v1/order')
        .set('x-access-token', token)
        .send({
          carId,
          price: '400000',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(201);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('car_id');
          res.body.data.should.have.property('created_on');
          res.body.data.should.have.property('buyer');
          orderId = res.body.data.id;
          done();
        });
    });

    it('should return status 200 order data if order was successfully updated', (done) => {
      requester.patch(`/api/v1/order/${orderId}/status`)
        .set('x-access-token', token)
        .send({ status: 'accepted' })
        .end((err, res) => {
          res.body.should.have.property('data');
          res.body.should.have.property('status').eql(200);
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('created_on');
          res.body.data.should.have.property('amount');
          res.body.data.should.have.property('status');
          res.body.data.should.have.property('original_price');
          res.body.data.should.have.property('buyer');
          res.body.data.should.have.property('car_id');
          done();
        });
    });

    it('should return status 500 error there was no result from query', (done) => {
      requester.patch('/api/v1/order/40/status')
        .set('x-access-token', token)
        .send({ status: 'accepted' })
        .end((err, res) => {
          res.body.should.have.property('status').eql(500);
          res.body.should.have.property('errors');
          res.body.should.have.property('message');
          done();
        });
    });

    it('should return status 500 error car in not in database', (done) => {
      requester.patch('/api/v1/order/40/status')
        .set('x-access-token', token)
        .send({ status: 'accepted' })
        .end((err, res) => {
          res.body.should.have.property('status').eql(500);
          res.body.should.have.property('errors');
          res.body.should.have.property('message');
          done();
        });
    });

    it('should return status 401, if non owner tries to access route', (done) => {
      requester.patch(`/api/v1/order/${orderId}/status`)
        .set('x-access-token', anotherToken)
        .send({ status: 'accepted' })
        .end((err, res) => {
          res.body.should.have.property('status').eql(401);
          res.body.should.have.property('errors');
          res.body.should.have.property('message');
          done();
        });
    });

    it('should return status 400, if invalid status is sent', (done) => {
      requester.patch(`/api/v1/order/${orderId}/status`)
        .set('x-access-token', token)
        .send({ status: 'thanks' })
        .end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('errors');
          res.body.should.have.property('message');
          done();
        });
    });

    it('should return status 500, if update returns no value', (done) => {
      requester.patch('/api/v1/order/40/status')
        .set('x-access-token', token)
        .send({ status: 'accepted' })
        .end((err, res) => {
          res.body.should.have.property('status').eql(500);
          res.body.should.have.property('errors');
          res.body.should.have.property('message');
          done();
        });
    });
  });/* STOP */
});
