// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/app';

// eslint-disable-next-line no-unused-vars
const should = chai.should();
chai.use(chaiHttp);


describe('USER ROUTES TEST', () => {
  const requester = chai.request(app).keepOpen();

  describe('/POST Register', () => {
    it('should correctly return a user data if sign up was successful', (done) => {
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
          res.body.should.have.property('message');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('firstName');
          res.body.data.should.have.property('lastName');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('address');
          done();
        });
    });

    it('should return an error in the responds body, when sign up lacks any user data', (done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          name: 'Ola',
          email: 'sole@yahoo.com',
          password: 'Password',
          confirmPassword: 'Password',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it(`should return an error in the responds body, 
    when signed in user is trying to access the signup route`, (done) => {
      requester.post('/api/v1/auth/signup')
        .set('x-access-token', 1234584)
        .send({
          name: 'Ola',
          email: 'sole@yahoo.com',
          password: 'Password',
          confirmPassword: 'Password',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(403);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });


    describe('/POST signup', () => {
      it('should correctly return a user data if sign up was successful', (done) => {
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
            res.body.should.have.property('message');
            res.body.should.have.property('data');
            res.body.data.should.be.a('object');
            res.body.data.should.have.property('id');
            res.body.data.should.have.property('firstName');
            res.body.data.should.have.property('lastName');
            res.body.data.should.have.property('email');
            res.body.data.should.have.property('address');
            done();
          });
      });

      // it('should correctly return a user data if sign in was successful', (done) => {
      //   requester.post('/api/v1/auth/signin')
      //     .send({
      //       email: 'sole@yahoo.com',
      //       password: 'hashedPassword',
      //     }).end((err, res) => {
      //       // console.log(res);
      // //       res.body.should.have.property('status').eql(200);
      // //       // res.body.should.have.property('data');
      // //       // res.body.data.should.be.a('object');
      // //       // res.body.data.should.have.property('id');
      // //       // res.body.data.should.have.property('firstName');
      // //       // res.body.data.should.have.property('lastName');
      // //       // res.body.data.should.have.property('email');
      //       done();
      //     });
      // });

      it('should return an error in the responds body, when sign in lacks any user data', (done) => {
        requester.post('/api/v1/auth/signin')
          .send({
            email: 'sole@yahoo.com',
          }).end((err, res) => {
            res.body.should.have.property('status').eql(400);
            res.body.should.have.property('message');
            res.body.should.have.property('errors');
            done();
          });
      });

      it('should return an error in the responds body, when user is not in the database', (done) => {
        requester.post('/api/v1/auth/signin')
          .send({
            email: 'sol@yahoo.com',
            password: 'Password',
          }).end((err, res) => {
            res.body.should.have.property('status').eql(401);
            res.body.should.have.property('message');
            res.body.should.have.property('errors');
            done();
          });
      });

      it(`should return an error in the responds body, 
      when signed in user is trying to access the signin route`, (done) => {
        requester.post('/api/v1/auth/signin')
          .set('x-access-token', 1234584)
          .send({
            email: 'sole@yahoo.com',
            password: 'Password',
          }).end((err, res) => {
            res.body.should.have.property('status').eql(403);
            res.body.should.have.property('message');
            res.body.should.have.property('errors');
            done();
          });
      });
    });
  });
});