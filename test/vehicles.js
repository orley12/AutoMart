// Require the dev-dependencies
import chai from 'chai';
import fs from 'fs';
import chaiHttp from 'chai-http';
import app from '../server/app';

// eslint-disable-next-line no-unused-vars
const should = chai.should();
chai.use(chaiHttp);


describe('CAR ROUTES TEST', () => {
  const requester = chai.request(app).keepOpen();
  describe('/POST car', () => {
    let token = '';
    before((done) => {
      requester.post('/api/v1/auth/signup')
        .send({
          name: 'Ola',
          email: 'sole@yahoo.com',
          phone: '09049908094',
          password: 'Password',
          confirmPassword: 'Password',
          address: 'okpjkdpjpejj',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(201);
          res.body.should.have.property('data');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('first_name');
          res.body.data.should.have.property('last_name');
          res.body.data.should.have.property('email');
          // res.body.data.should.have.property('address')
          token = res.body.data.token;
          console.log(`${token} HERE`);
          done();
        });
    });

    // it('should correctly return a car data if it was created successful', (done) => {
    //   console.log(token);
    //   requester.post('/api/v1/car')
    //     .set('x-access-token', token)
    //     .attach('exterior', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
    //     .attach('interior', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
    //     .attach('engine', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
    //     .field('data', JSON.stringify({
    //       manufacturer: 'aston-martin', model: 'stallion', price: '750000', state: 'new', body_type: 'sedan', transnmission: 'automatic', milage: '5000', year: '2018', exterior_img: 'car.exterior_img', interior_img: 'car.interior_img', engine_img: 'car.engine_img',
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
    //       res.body.data.should.have.property('body_type');
    //       res.body.data.should.have.property('milage');
    //       res.body.data.should.have.property('year');
    //       res.body.data.should.have.property('exterior_img');
    //       res.body.data.should.have.property('interior_img');
    //       res.body.data.should.have.property('engine_img');
    //       done();
    //     });
    // });

    it('should return an error, when car lacks price or any required data', (done) => {
      requester.post('/api/v1/car')
        .set('x-access-token', token)
        .attach('exterior', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
        .attach('interior', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
        .attach('engine', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
        .field('data', JSON.stringify({
          manufacturer: 'aston-martin', model: 'stallion', price: '750000', body_type: 'sedan', transnmission: 'automatic', milage: '5000', year: '2018', exterior_img: 'car.exterior_img', interior_img: 'car.interior_img', engine_img: 'car.engine_img',
        }))
        .end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('error');
          done();
        });
    });

    // it('should return an error, when no token is provide', (done) => {
    //   requester.post('/api/v1/car/')
    //     .attach('exterior', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
    //     .attach('interior', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
    //     .attach('engine', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
    //     .field('data', JSON.stringify({
    //       manufacturer: 'aston-martin', model: 'stallion', price: '750000', state: 'new', body_type: 'sedan', transnmission: 'automatic', milage: '5000', year: '2018', exterior_img: 'car.exterior_img', interior_img: 'car.interior_img', engine_img: 'car.engine_img',
    //     }))
    //     .end((err, res) => {
    //       res.body.should.have.property('status').eql(400);
    //       res.body.should.have.property('error');
    //       done();
    //     });
    // });


    after(() => {
      requester.close();
    });
  });
});
