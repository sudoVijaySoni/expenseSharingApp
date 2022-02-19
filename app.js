const express = require('express');
const path = require('path');
const logger = require('morgan');
const db = require("./config/db.config");
const bodyParser = require('body-parser');

//require routes
const createuser = require('./routes/createuserRoute'); //create user
const creategroup = require('./routes/creategroupRoute');//create group
const splitbill = require('./routes/splitbillRoute.js');//calculate expense
const displayExpense = require('./routes/displayexpenseRoute');

//express app
const app = express();

//middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//database connection
db.once('open', ()=>{
  console.log('Connected to Mongo DB Atlas');
});

//error handling for database
db.on('error', (err) => {
  console.log(err);
});

//routes
app.use('/user', createuser);
app.use('/group', creategroup);
app.use('/splitbill', splitbill);
app.use('/displayexpense',displayExpense);

//exporting app
module.exports = app;
