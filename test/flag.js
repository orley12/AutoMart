/* eslint-disable no-unused-expressions */
// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/app';

// eslint-disable-next-line no-unused-vars
const should = chai.should();
chai.use(chaiHttp);


describe('CAR ROUTES TEST', () => {
  const requester = chai.request(app).keepOpen();
  describe('/POST FLAG car', () => {
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

    it('/POST FLAG should return a 200 status,and flag sucessful data', (done) => {
      requester.post('/api/v1/flag')
        .set('x-access-token', token)
        .send({
          carId: '1',
          reason: 'weird demands',
          description: 'asdf;lkjaojocjojoajocjocjojiohjosjd',
        })
        .end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('created_on');
          res.body.data.should.have.property('car_id');
          res.body.data.should.have.property('user_id');
          res.body.data.should.have.property('reason');
          res.body.data.should.have.property('description');
          done();
        });
    });

    it('/POST FLAG should return a 404 status,if car to be flagged is not found', (done) => {
      requester.post('/api/v1/flag')
        .set('x-access-token', token)
        .send({
          carId: '100',
          reason: 'weird demands',
          description: 'asdf;lkjaojocjojoajocjocjojiohjosjd',
        })
        .end((err, res) => {
          res.body.should.have.property('status').eql(404);
          res.body.should.have.property('message');
          res.body.should.have.property('error');
          done();
        });
    });

    it('/POST FLAG should return a 400 status,if a reason is not provided', (done) => {
      requester.post('/api/v1/flag')
        .set('x-access-token', token)
        .send({
          description: 'asdf;lkjaojocjojoajocjocjojiohjosjd',
        })
        .end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('error');
          done();
        });
    });

    it('/POST FLAG should return a 400 status,if a description is not provided', (done) => {
      requester.post('/api/v1/flag')
        .set('x-access-token', token)
        .send({
          reason: 'weird demands',
        })
        .end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('error');
          done();
        });
    });

    it('/POST FLAG should return a 400 status,if reason is less than 6 chars or greater than 50', (done) => {
      requester.post('/api/v1/flag')
        .set('x-access-token', token)
        .send({
          reason: 'we',
          description: 'asdf;lkjaojocjojoajocjocjojiohjosjd',
        })
        .end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('error');
          done();
        });
    });

    it('/POST FLAG should return a 400 status,if reason is less than 10 chars or greater than 200', (done) => {
      requester.post('/api/v1/flag')
        .set('x-access-token', token)
        .send({
          reason: 'weird demands',
          description: 'as',
        })
        .end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('error');
          done();
        });
    });

    it('/POST FLAG should return a 400 status,if a token is not provided', (done) => {
      requester.post('/api/v1/flag')
        .send({
          reason: 'weird demands',
          description: 'asdf;lkjaojocjojoajocjocjojiohjosjd',
        })
        .end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('error');
          done();
        });
    });

    
    it('/POST FLAG should return a 401 status,if token provided is not valid', (done) => {
      requester.post('/api/v1/flag')
        .set('x-access-token', 1234567980)
        .send({
          reason: 'weird demands',
          description: 'asdf;lkjaojocjojoajocjocjojiohjosjd',
        })
        .end((err, res) => {
          res.body.should.have.property('status').eql(401);
          res.body.should.have.property('message');
          res.body.should.have.property('error');
          done();
        });
    });
  });/* STOP */
});
