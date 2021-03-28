// The initial import and inititalization of modules and their objects.

// Requiring and initializing the express object.
const express = require("express");
const app = express();

// Requiring the mongoose module and checking if the connection is actually made.
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/SkaraDB",{
  useNewUrlParser: true,
  useUnifiedTopology:true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('Database connected');
});

// Requiring the morgan module.
const morgan = require('morgan');

// Requiring the path module. 
const path = require('path');

// Defining the port
const PORT = process.env.PORT || 5000;

// Use the HTML Logger (morgan).
app.use(morgan('tiny'));

// Kind of bodyParser. It makes the json objects available.
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))

// Requiring the models
const classroom = require('./models/classroomModel.js');
const student = require('./models/studentModel.js');
const teacher = require('./models/teacherModel.js');
const team = require('./models/teamModel.js');

// This get function throws html our home page once the sever gets called on default port.
app.get('/', function(req, res){
  res.sendFile(__dirname + '/html_files/index.html');
});

// This get function listens opens up the register page when register button is clicked upon on the home page.
app.get('/register', function(req,res){
  res.sendFile(__dirname + '/html_files/register.html');
});

// This get function handles the login route.
app.get("/login", function(req,res){
  res.sendFile(__dirname + '/html_files/login.html')
})

// Post request to the register route.
app.post("/register", function(req,res){
  const studentData = new student({
    firstName: req.body.fn,
    lastName: req.body.ln,
    sid: req.body.sid,
    password: req.body.pw
  });
  console.log(studentData);
  const exist = student.count({sid: studentData.sid}, function(err, num){
    if(err){
      console.log(err);
    }
    else{
      if(num === 0){
        studentData.save(function(err, User){
          if(err){
            console.log(err);
            res.send('There is an unexpected error. Try again!');
          }
          else{
            res.send('<h1>You have been Logged in.</h1>')
          }
        });
      }
      else{
        res.send("Sorry! This SID is already registered.")
      }
    }
  });
})

// Post request to the login route.
app.post("/login", function(req,res){
  const newStudent = new student({
    sid: req.body.sid,
    password: req.body.password
  });
  var query = student.findOne({sid: newStudent.sid}, function(err, currentStudent){
    if(err){
      console.log(err);
    }
    else{
      if(currentStudent.sid === newStudent.sid && currentStudent.password === newStudent.password){
        res.sendFile(__dirname + '/html_files/dashboard.html');
      }
      else{
        res.send('<h1>Enter the correct details.</h1>');
      }
    }
  });
})

// Listening to the port 3000.
app.listen(PORT, function(){
  console.log("Server is listening to port ", PORT);
});
