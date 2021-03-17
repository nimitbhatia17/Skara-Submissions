// The initial import and inititalization of modules and their objects

// Requiring and initializing the express object
const express = require("express");
const app = express();

// Requiring the mongoose module
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/SkaraDB",{
  useNewUrlParser: true,
  useUnifiedTopology:true
});

// To check whether the connection has been established or not
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('Database connected');
});

// Requiring the body-parser module
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));

// Defining the schema of classroom
const classSchema = new mongoose.Schema({
  classCode: String,
  subject: String,
  announcements: [{
    text: String
  }]
});
const classroom = mongoose.model('classroom', classSchema);

// Defining the schema of students
const studentSchema = new mongoose.Schema({
  sid: String,
  firstName: String,
  lastName: String,
  classesJoined: [{
    type: mongoose.Schema.Types.ObjectID,
    ref: 'class'
  }],
  password: String
});
const student = mongoose.model('student', studentSchema);

// Defining the schema of teacher
const teacherSchema = new mongoose.Schema({
  teacherID: String,
  password: String,
  classesMade: [{
    type: mongoose.Schema.Types.ObjectID,
    ref: 'classroom'
  }]
});
const teacher = mongoose.model('teacher', studentSchema);

// This get function throws html our home page once the sever gets called on default port 3000.
app.get('/', function(req, res){
  res.sendFile(__dirname + '/html_files/index.html');
});

// This get function listens opens up the register page when register button is clicked upon on the home page
app.get('/register', function(req,res){
  res.sendFile(__dirname + '/html_files/register.html');
});

// This get function handles the login route
app.get("/login", function(req,res){
  res.sendFile(__dirname + '/html_files/login.html')
})

// Post request to the register route
app.post("/register", function(req,res){
  const studentData = new student({
    firstName: req.body.fn,
    lastName: req.body.ln,
    sid: req.body.sid,
    password: req.body.pw
  });
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

// Post request to the login route
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
        res.send('<h1>You have been Logged in.</h1>');
      }
      else{
        res.send('<h1>Enter the correct details.</h1>');
      }
    }
  });
})

// Listening to the port 3000.
app.listen(3000, function(){
  console.log("Server is listening to port 3000.");
});
