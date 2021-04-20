var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Connect to MongoDB server with Mongoose

const mongoose = require('mongoose');

const URI = "mongodb+srv://johannabertils:Bertils96@nyhetsbrev.vrps7.mongodb.net/Nyhetsbrev?retryWrites=true&w=majority";

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on("connected", () => {
    console.log("mongoose is connected");
});

// define schema

const Schema = mongoose.Schema;
const usersSchema = new Schema({
    userName: String, 
    password: String,
    email: String, 
    subscribe: { type : Boolean }
});

// model
const usersModel = mongoose.model("users", usersSchema);

// save data to mongodatabase
const data ={
    userName: "Johanna", 
    password: "johanna", 
    email: "johanna@outlook.com",
    subscribe: true
};

const newUser = new usersModel(data);

newUser.save((error)=> {
if (error) {
    console.log("something happened")
} else {
    console.log("Data has been saved");
}
}); 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
