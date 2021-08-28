const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');
const routeV1 = require('./routerV1');
const passport = require('passport');

const app = express();
app.use(cors());
app.use(helmet());

app.use(logger('dev'));
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/api/v1/', routeV1);
app.use('/images', express.static(__dirname + "\\public\\data\\uploads"));

app.use(errorHandler);

module.exports = app;
