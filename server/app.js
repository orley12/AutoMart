import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';

const app = express();
const port = parseInt(process.env.PORT, 10) || 3000;

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.status(300).send({
  message: 'welcome to the start of greater things',
}));

app.listen(port, () => console.log(`server running on port ${port}`));
