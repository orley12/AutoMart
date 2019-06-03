/* eslint-disable no-unused-vars */
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import vehicleRoutes from './routes/vehicle';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/car', vehicleRoutes);


app.use((req, res, next) => {
  console.log('CALLED JOBe');
  const err = new Error('Resource Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log('CALLED JOB');
  res.json({
    status: err.status || 500,
    error: err.message,
  });
});

const port = parseInt(process.env.PORT, 10) || 3000;
// eslint-disable-next-line no-console
app.listen(port, () => console.log(`server running on port ${port}`));

module.exports = app;
