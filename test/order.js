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
    let token = '';
    before((done) => {
      requester.post('/api/v1/auth/signin')
        .send({
          email: 'sole@yahoo.com',
          password: 'hashedPassword',
        }).end((err, res) => {
          console.log(res);
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('firstname');
          res.body.data.should.have.property('lastname');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('address');
          // eslint-disable-next-line prefer-destructuring
          token = res.body.data.token;
          console.log(`${token} HERE`);
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
          res.body.data.should.have.property('status');
          res.body.data.should.have.property('amount');
          done();
        });
    });

    it('should return status 400 and error, if carId or offerPrice is not provided', (done) => {
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

    it('should return status 404 and error, if car specified is not found', (done) => {
      requester.post('/api/v1/order')
        .set('x-access-token', token)
        .send({
          carId: '10',
          price: '400000',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(417);
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
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('firstname');
          res.body.data.should.have.property('lastname');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('address');
          // eslint-disable-next-line prefer-destructuring
          token = res.body.data.token;
          console.log(`${token} HERE`);
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
          res.body.data.should.have.property('status');
          res.body.data.should.have.property('oldPrice');
          res.body.data.should.have.property('newPrice');
          done();
        });
    });

    it('should return status 400 and error, if offeredPrice is not provided', (done) => {
      requester.patch('/api/v1/order/1/price')
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
