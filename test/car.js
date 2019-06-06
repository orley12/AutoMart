// Require the dev-dependencies
import chai from 'chai';
import fs from 'fs';
import chaiHttp from 'chai-http';
import app from '../server/app';

// eslint-disable-next-line no-unused-vars
const should = chai.should();
const expect = chai.expect();
chai.use(chaiHttp);


describe('CAR ROUTES TEST', () => {
  const requester = chai.request(app).keepOpen();
  describe('/POST car', () => {
    let token = '';
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
          done();
        });
    });

    it('should return an error, when car lacks price or any required data', (done) => {
      requester.post('/api/v1/car')
        .set('x-access-token', token)
        .attach('exterior', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
        .attach('interior', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
        .attach('engine', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
        .field('data', JSON.stringify({
          manufacturer: 'aston-martin', model: 'stallion', price: '750000', bodyType: 'sedan', transnmission: 'automatic', milage: '5000', year: '2018', exteriorImg: 'car.exterior_img', interiorImg: 'car.interior_img', engineImg: 'car.engine_img',
        }))
        .end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('should return an error, when no token is provide', (done) => {
      requester.post('/api/v1/car/')
        .attach('exterior', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
        .attach('interior', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
        .attach('engine', fs.readFileSync('./test/img/coupe.png'), 'coupe.png')
        .field('data', JSON.stringify({
          manufacturer: 'aston-martin', model: 'stallion', price: '750000', state: 'new', bodyType: 'sedan', transnmission: 'automatic', milage: '5000', year: '2018', exteriorImg: 'car.exterior_img', interiorImg: 'car.interior_img', engineImg: 'car.engine_img',
        }))
        .end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    describe('/GET car', () => {
      it('should return a status 200,and an array of car objects', (done) => {
        requester.get('/api/v1/car')
          .set('x-access-token', token)
          .end((err, res) => {
            res.body.should.have.property('status').eql(200);
            res.body.should.have.property('message').eql('success');
            res.body.data.should.be.a('array');
            done();
          });
      });

      it('should return a status 200,and an array of car objects', (done) => {
        requester.get('/api/v1/car?manufacturer=aston-martin')
          .set('x-access-token', token)
          .end((err, res) => {
            res.body.should.have.property('status').eql(200);
            res.body.should.have.property('message').eql('success');
            res.body.data.should.be.a('array').that.does.not.include({});
            done();
          });
      });
    });

    it('should return a status 200,and an array of car objects', (done) => {
      requester.get('/api/v1/car?manufacturer=sedan')
        .set('x-access-token', token)
        .end((err, res) => {
          const data = JSON.parse(res.body.data);
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message').eql('success');
          data.should.be.a().that.does.not.include({});
          // eslint-disable-next-line no-unused-expressions
          expect(data).to.be.empty;
          done();
        });
    });

    it('should return a status 200,and an array of car objects with property manufacturer = aston-martin', (done) => {
      requester.get('/api/v1/car?manufacturer=aston-martin')
        .set('x-access-token', token)
        .end((err, res) => {
          const data = JSON.parse(res.body.data);
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message').eql('success');
          // eslint-disable-next-line no-unused-expressions
          expect(data).to.not.be.empty;
          done();
        });
    });
  });

  after(() => {
    requester.close();
  });
});
