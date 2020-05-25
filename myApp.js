const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
var app = express();

const db = config.get('mongoURI');
const Users = require('./models/Users');

mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// --> 7)  Mount the Logger middleware here
app.use((req, res, next) => {
  const string = `${req.method} ${req.path} - ${req.ip}`;
  console.log(string);
  next();
})

// --> 11)  Mount the body-parser middleware  here
app.use(express.urlencoded({extended: false}));
app.use(express.json());

/** 1) Meet the node console. */
console.log("Hello World")

/** 2) A first working Express Server */
// app.get('/', ((req, res) => {
//   res.send('Hello Express');
// }))

/** 3) Serve an HTML file */
app.get('/', ((req, res) => {
  res.sendFile(__dirname + '/views/index.html');
}))

/** 4) Serve static assets  */
app.use(express.static(__dirname + '/public'))

/** 5) serve JSON on a specific route */


/** 6) Use the .env file to configure the app */
app.get("/json", ((req,res) => {
  let msgobj = {"message" :"Hello json"};
     msgobj.message = msgobj.message.toUpperCase();
  res.json(msgobj);
}));
 
/** 7) Root-level Middleware - A logger */
//  place it before all the routes !


/** 8) Chaining middleware. A Time server */
app.get('/now', ((req, res, next) => {
  req.time = new Date().toString();
  next();
}), ((req, res) => {
  res.json({time: req.time});
}));

/** 9)  Get input from client - Route parameters */
app.get('/:word/echo', ((req, res) => {
  res.json({echo: req.params.word})
}))

/** 10) Get input from client - Query parameters */
// /name?first=<firstname>&last=<lastname>
app.get("/name", ((req, res) => { 
  const { first: firstName, last: lastName } = req.query;
  res.json({
    name: `${firstName} ${lastName}`
  });
}));
  
/** 11) Get ready for POST Requests - the `body-parser` */
// place it before all the routes !


/** 12) Get data form POST  */
app.post('/', (req, res) => {
  const newUser = new Users({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  newUser
    .save()
    .then( Users.find()
     .sort({ date: -1 })
     .then(items => res.json(items))
    );
});

// This would be part of the basic setup of an Express app
// but to allow FCC to run tests, the server is already active
 app.listen(process.env.PORT || 3000 ); 

//---------- DO NOT EDIT BELOW THIS LINE --------------------

 module.exports = app;
