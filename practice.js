const express = require('express');
const mongoose = require('mongoose');
const app = express();
mongoose.connect("mongodb://localhost/Skara",{useNewUrlParser:true, useUnifiedTopology:true});
// To check whether the connection has been estabilished or not
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database connected');
});
console.log("Hello World!");
const studentSchema = new mongoose.Schema({
  sid: String,
  firstName: String,
  lastName: String,
  classesJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' }],
  password: String
});
const classroomSchema = new mongoose.Schema({
  classID: String,
  subject: String
});
const student = mongoose.model('student', studentSchema);
const classroom = mongoose.model('classroom', classroomSchema);
const studentData = new student({
  firstName: 'Nimit',
  lastName: 'Bhatia',
  sid: '19103046',
  password: 'lingo786'
});
studentData.save();
const classData = new classroom({
  classID: "1",
  subject: "Computer Science"
});
classData.save();
