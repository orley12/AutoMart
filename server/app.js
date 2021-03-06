/* eslint-disable no-unused-vars */
import '@babel/polyfill';
import express from 'express';

import logger from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUI from 'swagger-ui-express';
import authRoutes from './routes/authRoutes';
import carRoutes from './routes/carRoutes';
import flagRoutes from './routes/flagRoutes';
import orderRoutes from './routes/orderRoutes';
import docs from '../swagger.json';

const expressValidator = require('express-validator');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/car', carRoutes);
app.use('/api/v1/flag', flagRoutes);
app.use('/api/v1/order', orderRoutes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs));

app.use((req, res, next) => {
  const err = new Error('Resource Not Found');
  err.status = 404;
  err.errors = ['Resource Not Found'];
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status).json({
    status: err.status || 500,
    message: err.message,
    error: err.errors,
  });
});

let port;
if (process.env.NODE_ENV === 'test') {
  port = process.env.TEST_PORT || 4004;
} else {
  port = process.env.PORT || 4000;
}

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`server running on port ${port}`));

module.exports = app;
