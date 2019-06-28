/* eslint-disable no-unused-expressions */
// Require the dev-dependencies
import chai from 'chai';
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
          res.body.data.should.have.property('firstName');
          res.body.data.should.have.property('lastName');
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
          carId: '2',
          price: '400000',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(201);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('carid');
          res.body.data.should.have.property('createdon');
          res.body.data.should.have.property('buyer');
          res.body.data.should.have.property('originalPrice');
          res.body.data.should.have.property('status');
          res.body.data.should.have.property('amount');
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
          carId: '2',
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
          res.body.data.should.have.property('firstName');
          res.body.data.should.have.property('lastName');
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
          res.body.data.should.have.property('carid');
          res.body.data.should.have.property('createdon');
          res.body.data.should.have.property('buyer');
          res.body.data.should.have.property('status');
          res.body.data.should.have.property('oldPrice');
          res.body.data.should.have.property('newPrice');
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
});
