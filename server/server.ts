import express from 'express';
import { routes } from './routes';

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'),
  res.header('Access-Control-Allow-Headers', 'Origin, x-requested-with, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    console.log(`${req.ip} ${req.method} ${req.url}`);
    next();
  }
});

app.use(express.json());

app.use('/', routes);

app.listen(4201, '127.0.0.1', function() {
  console.log('Server now listening on port 4201');
});