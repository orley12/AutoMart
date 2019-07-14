import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/app';

// eslint-disable-next-line no-unused-vars
const should = chai.should();
const { expect } = chai;

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
          if (res.body.status === 201) {
            res.body.should.have.property('status').eql(201);
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
          } else {
            res.body.should.have.property('status').eql(409);
            res.body.should.have.property('message');
            res.body.should.have.property('errors');
          }
          done();
        });
    });

    it('should return an error in the responds body, when sign up lacks email', (done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          firstName: 'Ola',
          lastName: 'Ola',
          phone: '09049908094',
          password: 'hashedPassword',
          confirmPassword: 'hashedPassword',
          address: 'akmodojojfoj',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when invalid is entered email', (done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          firstName: 'Ola',
          lastName: 'Ola',
          email: 'soleyahoo.com',
          phone: '09049908094',
          password: 'hashedPassword',
          confirmPassword: 'hashedPassword',
          address: 'akmodojojfoj',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when sign up lacks firstname', (done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          lastName: 'Ola',
          email: 'sole@yahoo.com',
          phone: '09049908094',
          password: 'hashedPassword',
          confirmPassword: 'hashedPassword',
          address: 'akmodojojfoj',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when firstname less than 3 or greater than 15', (done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          firstName: 'Ol',
          lastName: 'Ola',
          email: 'sole@yahoo.com',
          phone: '09049908094',
          password: 'hashedPassword',
          confirmPassword: 'hashedPassword',
          address: 'akmodojojfoj',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when firstname contains non alphabet', (done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          firstName: 'Ola1',
          lastName: 'Ola',
          email: 'sole@yahoo.com',
          phone: '09049908094',
          password: 'hashedPassword',
          confirmPassword: 'hashedPassword',
          address: 'akmodojojfoj',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when sign up lacks lastName', (done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          firstName: 'Ola',
          email: 'sole@yahoo.com',
          phone: '09049908094',
          password: 'hashedPassword',
          confirmPassword: 'hashedPassword',
          address: 'akmodojojfoj',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when lastName less than 3 or greater than 15', (done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          firstName: 'Ola',
          lastName: 'unclejohndoesaranoff',
          email: 'sole@yahoo.com',
          phone: '09049908094',
          password: 'hashedPassword',
          confirmPassword: 'hashedPassword',
          address: 'akmodojojfoj',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when lastName contains non alphabet', (done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          firstName: 'Ola',
          lastName: 'Ola1',
          email: 'sole@yahoo.com',
          phone: '09049908094',
          password: 'hashedPassword',
          confirmPassword: 'hashedPassword',
          address: 'akmodojojfoj',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when sign up lacks password', (done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          firstName: 'Ola',
          lastName: 'Ola',
          email: 'sole@yahoo.com',
          phone: '09049908094',
          confirmPassword: 'hashedPassword',
          address: 'akmodojojfoj',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when less than 6 or greater than 15 password', (done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          firstName: 'Ola',
          lastName: 'Ola',
          email: 'sole@yahoo.com',
          phone: '09049908094',
          password: 'has',
          confirmPassword: 'hashedPassword',
          address: 'akmodojojfoj',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when sign up lacks confirmPassword', (done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          firstName: 'Ola',
          lastName: 'Ola',
          email: 'sole@yahoo.com',
          phone: '09049908094',
          password: 'hashedPassword',
          address: 'akmodojojfoj',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when password && confirmPassword don\'t match', (done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          firstName: 'Ola',
          lastName: 'Ola',
          email: 'sole@yahoo.com',
          phone: '09049908094',
          password: 'hashedPassword',
          confirmPassword: 'hashedPasswor',
          address: 'akmodojojfoj',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when phone contains invalid input', (done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          firstName: 'Ola',
          lastName: 'Ola',
          email: 'sole@yahoo.com',
          phone: '0904990a8094',
          password: 'hashedPassword',
          confirmPassword: 'hashedPassword',
          address: 'akmodojojfoj',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when phone length is greater than 15 lesser than 6', (done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          firstName: 'Ola',
          lastName: 'Ola',
          email: 'sole@yahoo.com',
          phone: '0904990809422222111333555',
          password: 'hashedPassword',
          confirmPassword: 'hashedPassword',
          address: 'akmodojojfoj',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when sign up lacks phone', (done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          firstName: 'Ola',
          lastName: 'Ola',
          email: 'sole@yahoo.com',
          password: 'hashedPassword',
          confirmPassword: 'hashedPassword',
          address: 'akmodojojfoj',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when sign up lacks address', (done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          firstName: 'Ola',
          lastName: 'Ola',
          email: 'sole@yahoo.com',
          phone: '09049908094',
          password: 'hashedPassword',
          confirmPassword: 'hashedPassword',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when address length is less than 10 or greater that 50 ', (done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          firstName: 'Ola',
          lastName: 'Ola',
          email: 'sole@yahoo.com',
          phone: '09049908094',
          password: 'hashedPassword',
          confirmPassword: 'hashedPassword',
          address: 'akm',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when existing user tries to re-sign up', (done) => {
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
          res.body.should.have.property('status').eql(409);
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
          firstName: 'Ola',
          lastName: 'Ola',
          email: 'sole@yahoo.com',
          phone: '09049908094',
          password: 'hashedPassword',
          confirmPassword: 'hashedPassword',
          address: 'akmodojojfoj',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body,  when trying to access a resource that is not found', (done) => {
      requester.get('/')
        .end((err, res) => {
          res.body.should.have.property('status').eql(404);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });
  }); // END

  describe('/POST reset password', () => {
    let resetToken = '';

    it('should return reset token when endpoint is called with no body', (done) => {
      requester.post('/api/v1/auth/johndoe@gmail.com/resetPassword')
        .send().end((err, res) => {
          res.body.should.have.property('status').eql(204);
          res.body.should.have.property('message');
          res.body.should.have.property('data');
          res.body.data.should.have.property('message');
          res.body.data.should.have.property('token');
          resetToken = res.body.data.token;
          done();
        });
    });

    it('should return reset success message', (done) => {
      requester.post('/api/v1/auth/johndoe@gmail.com/resetPassword')
        .query({ token: resetToken })
        .send({
          password: 'newpass',
          confirmPassword: 'newpass',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message').eql('Success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('message');
          done();
        });
    });

    it('should return 200 status and success message when password is reset', (done) => {
      requester.post('/api/v1/auth/johndoe@gmail.com/resetPassword')
        .send({
          password: 'newpass',
          newPassword: 'password',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message').eql('Success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('message');
          done();
        });
    });

    it('should return error if email is not found', (done) => {
      requester.post('/api/v1/auth/johnnydoe@gmail.com/resetPassword')
        .send({}).end((err, res) => {
          res.body.should.have.property('status').eql(404);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return error if email is not found', (done) => {
      requester.post('/api/v1/auth/johnnydoe@gmail.com/resetPassword')
        .query({ token: resetToken })
        .send({
          password: 'newpass',
          confirmPassword: 'newpass',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(404);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return error if invalid token is sent', (done) => {
      requester.post('/api/v1/auth/johndoe@gmail.com/resetPassword')
        .query({ token: resetToken + 22 })
        .send({
          password: 'newpass',
          confirmPassword: 'newpass',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return error responds if email is not found', (done) => {
      requester.post('/api/v1/auth/johnnnydoe@gmail.com/resetPassword')
        .send({
          password: 'newpass',
          newPassword: 'password',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(404);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return error responds if password is wrong', (done) => {
      requester.post('/api/v1/auth/johndoe@gmail.com/resetPassword')
        .send({
          password: 'newpasss',
          newPassword: 'password',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });
  }); // END

  describe('/POST signin', () => {
    it('should correctly return a user data if sign in was successful', (done) => {
      requester.post('/api/v1/auth/signin')
        .send({
          email: 'sole@yahoo.com',
          password: 'hashedPassword',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('token');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('first_name');
          res.body.data.should.have.property('last_name');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('phone');
          res.body.data.should.have.property('address');
          done();
        });
    });
    it('should return an error in the responds body, when sign up lacks email', (done) => {
      requester.post('/api/v1/auth/signin')
        .send({
          password: 'hashedPassword',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when invalid is entered email', (done) => {
      requester.post('/api/v1/auth/signin')
        .send({
          email: 'soleyahoo.com',
          password: 'hashedPassword',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when no password is entered', (done) => {
      requester.post('/api/v1/auth/signin')
        .send({
          email: 'sol@yahoo.com',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when user enters wrong email', (done) => {
      requester.post('/api/v1/auth/signin')
        .send({
          email: 'sol@yahoo.com',
          password: 'hashedPassword',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(404);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error in the responds body, when user enters wrong password', (done) => {
      requester.post('/api/v1/auth/signin')
        .send({
          email: 'sole@yahoo.com',
          password: 'hashedPasswor',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
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
          password: 'hashedPassword',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });
  }); // END

  describe('/GET users', () => {
    let token = '';
    let otherToken = '';
    let thirdToken = '';
    before((done) => {
      requester.post('/api/v1/auth/signin')
        .send({
          email: 'admin@auto-mart.com',
          password: 'admin',
        }).end((_err, res) => {
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
          email: 'johndoe@gmail.com',
          password: 'password',
        }).end((_err, res) => {
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
          otherToken = res.body.data.token;
        });

      requester.post('/api/v1/auth/signin')
        .send({
          email: 'mannyjenson@gmail.com',
          password: 'password',
        }).end((_err, res) => {
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
          thirdToken = res.body.data.token;
          done();
        });
    });

    it('should return an array of users, with a status and message field', (done) => {
      requester.get('/api/v1/auth/users')
        .set('x-access-token', token)
        .end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message').eql('success');
          res.body.data.should.be.a('array');
          expect(res.body.data).to.have.lengthOf.at.least(1);
          done();
        });
    });

    it('should return error if non admin tries accessing this route', (done) => {
      requester.get('/api/v1/auth/users')
        .set('x-access-token', otherToken)
        .end((err, res) => {
          res.body.should.have.property('status').eql(401);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return success message when delete is successful', (done) => {
      requester.delete('/api/v1/auth')
        .set('x-access-token', thirdToken)
        .end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message').eql('Request Successful');
          res.body.should.have.property('data').eql('Car Ad successfully deleted');
          done();
        });
    });

    it('should return success message when delete is successful', (done) => {
      requester.delete('/api/v1/auth')
        .set('x-access-token', thirdToken)
        .end((err, res) => {
          res.body.should.have.property('status').eql(404);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });
  }); // END

  describe('/ PATCH update user status', () => {
    let token = '';
    // let otherToken = '';
    let thirdToken = '';
    before((done) => {
      requester.post('/api/v1/auth/signin')
        .send({
          email: 'admin@auto-mart.com',
          password: 'admin',
        }).end((_err, res) => {
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
          // done();
        });

      // requester.post('/api/v1/auth/signin')
      //   .send({
      //     email: 'johndoe@gmail.com',
      //     password: 'password',
      //   }).end((_err, res) => {
      //     res.body.should.have.property('status').eql(200);
      //     res.body.should.have.property('message');
      //     res.body.should.have.property('data');
      //     res.body.data.should.be.a('object');
      //     res.body.data.should.have.property('token');
      //     res.body.data.should.have.property('id');
      //     res.body.data.should.have.property('first_name');
      //     res.body.data.should.have.property('last_name');
      //     res.body.data.should.have.property('email');
      //     res.body.data.should.have.property('phone');
      //     res.body.data.should.have.property('address');
      //     otherToken = res.body.data.token;
      //     done();
      //   });

      requester.post('/api/v1/auth/signin')
        .send({
          email: 'sam@gmail.com',
          password: 'password',
        }).end((_err, res) => {
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
          thirdToken = res.body.data.token;
          done();
        });
    });

    it('should return user data if update is successful', (done) => {
      requester.patch('/api/v1/auth/2/status')
        .set('x-access-token', token)
        .send({
          status: true,
        })
        .end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message');
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('first_name');
          res.body.data.should.have.property('last_name');
          res.body.data.should.have.property('email');
          res.body.data.should.have.property('phone');
          res.body.data.should.have.property('address');
          done();
        });
    });

    it('should return error if non admin tries accessing this route', (done) => {
      requester.patch('/api/v1/auth/2/status')
        .set('x-access-token', thirdToken)
        .send({
          status: true,
        })
        .end((err, res) => {
          res.body.should.have.property('status').eql(401);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });
  }); // END
});
