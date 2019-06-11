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
  });/* STOP */

  describe('/GET car', () => {
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

    it('should return an array of cars, with a status and message field', (done) => {
      requester.get('/api/v1/car')
        .end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message').eql('success');
          res.body.data.should.be.a('array');
          expect(res.body.data).to.have.lengthOf.at.least(1);
          done();
        });
    });

    it('should return an empty array of cars, when manufacturer query param is not found', (done) => {
      requester.get('/api/v1/car')
        .query({ manufacturer: 'ferrari' })
        .end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message').eql('success');
          res.body.data.should.be.a('array').that.does.not.include({});
          expect(res.body.data).to.be.empty;
          done();
        });
    });

    it('should return an empty array of cars, when state query param is not found', (done) => {
      requester.get('/api/v1/car')
        .query({ state: 'used' })
        .end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message').eql('success');
          res.body.data.should.be.a('array').that.does.not.include({});
          expect(res.body.data).to.be.empty;
          done();
        });
    });

    it('should return an empty array of cars, when bodyType query param is not found', (done) => {
      requester.get('/api/v1/car')
        .query({ bodyType: 'coupe' })
        .end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message').eql('success');
          res.body.data.should.be.a('array').that.does.not.include({});
          expect(res.body.data).to.be.empty;
          done();
        });
    });

    it('should return an empty array of cars, when minPrice query param is not found', (done) => {
      requester.get('/api/v1/car')
        .query({ minPrice: 1200000 })
        .end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message').eql('success');
          res.body.data.should.be.a('array').that.does.not.include({});
          expect(res.body.data).to.be.empty;
          done();
        });
    });

    it('should return an array of cars, when maxPrice query param is found', (done) => {
      requester.get('/api/v1/car')
        .query({ maxPrice: 1200000 })
        .end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message').eql('success');
          res.body.data.should.be.an('array');
          expect(res.body.data).to.have.lengthOf.at.least(1);
          done();
        });
    });
  });/* STOP */

  describe('/PATCH STATUS car', () => {
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

    it('/PATCH CAR STATUS should return updated car data', (done) => {
      requester.patch('/api/v1/car/0/status')
        .set('x-access-token', token)
        .send({
          status: 'sold',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data');
          res.body.should.have.property('message');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id');
          // res.body.data.should.have.property('email');
          res.body.data.should.have.property('createdOn');
          res.body.data.should.have.property('manufacturer');
          res.body.data.should.have.property('model');
          res.body.data.should.have.property('status');
          res.body.data.should.have.property('price');
          done();
        });
    });

    it('/PATCH CAR STATUS should return error if no token is provided', (done) => {
      requester.patch('/api/v1/car/0/status')
        .send({
          status: 'sold',
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('/PATCH CAR STATUS should return error if no status is added', (done) => {
      requester.patch('/api/v1/car/0/status')
        .set('x-access-token', token)
        .send().end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });
  });/* STOP */

  describe('/PATCH PRICE car', () => {
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

    it('/PATCH CAR PRICE should return updated car data', (done) => {
      requester.patch('/api/v1/car/0/price')
        .set('x-access-token', token)
        .send({
          price: 10000,
        }).end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('data');
          res.body.should.have.property('message');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id');
          // res.body.data.should.have.property('email');
          res.body.data.should.have.property('createdOn');
          res.body.data.should.have.property('manufacturer');
          res.body.data.should.have.property('model');
          res.body.data.should.have.property('status');
          res.body.data.should.have.property('price').eql(10000);
          done();
        });
    });

    it('/PATCH CAR PRICE should return error if no token is provided', (done) => {
      requester.patch('/api/v1/car/0/price')
        .send({
          price: 10000,
        }).end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('/PATCH CAR PRICE should return error if no status is added', (done) => {
      requester.patch('/api/v1/car/0/status')
        .set('x-access-token', token)
        .send().end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });
  });/* STOP */

  describe('/POST FLAG car', () => {
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

    it('/POST FLAG should return a 200 status,and flag sucessful data', (done) => {
      requester.post('/api/v1/car/0/flag')
        .set('x-access-token', token)
        .send({
          carId: '0',
          reason: 'weird demands',
          description: 'asdf;lkjaojocjojoajocjocjojiohjosjd',
        })
        .end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.data.should.have.property('id');
          res.body.data.should.have.property('carId');
          res.body.data.should.have.property('reason');
          res.body.data.should.have.property('description');
          done();
        });
    });

    it('/POST FLAG should return a 400 status,if a reason is not provided', (done) => {
      requester.post('/api/v1/car/0/flag')
        .set('x-access-token', token)
        .send({
          description: 'asdf;lkjaojocjojoajocjocjojiohjosjd',
        })
        .end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('/POST FLAG should return a 401 status,if a token is not provided', (done) => {
      requester.post('/api/v1/car/0/flag')
        .send({
          reason: 'weird demands',
          description: 'asdf;lkjaojocjojoajocjocjojiohjosjd',
        })
        .end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });
  });/* STOP */

  describe('/DELETE car', () => {
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

    it('/DELETE CAR should return a 200 status,and delete sucessful data', (done) => {
      requester.delete('/api/v1/car/0')
        .set('x-access-token', token)
        .end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message').eql('Request Successful');
          res.body.should.have.property('data').eql('Car Ad successfully deleted');
          done();
        });
    });

    it('/DELETE CAR should return a 400 error status,if no token is provided', (done) => {
      requester.delete('/api/v1/car/0')
        .end((err, res) => {
          res.body.should.have.property('status').eql(400);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });

    it('/DELETE CAR should return a 404 error status,if :id provided is not in database', (done) => {
      requester.delete('/api/v1/car/5')
        .set('x-access-token', token)
        .end((err, res) => {
          res.body.should.have.property('status').eql(404);
          res.body.should.have.property('message');
          res.body.should.have.property('errors');
          done();
        });
    });
  });/* STOP */

  describe('/DELETE car', () => {
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

    it('/DELETE CAR should return a 200 status,and delete sucessful data', (done) => {
      requester.delete('/api/v1/car/0')
        .set('x-access-token', token)
        .end((err, res) => {
          res.body.should.have.property('status').eql(200);
          res.body.should.have.property('message').eql('Request Successful');
          res.body.should.have.property('data').eql('Car Ad successfully deleted');
          done();
        });
    });
  });/* STOP */
});
