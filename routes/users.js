var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");

router.use(cors()); 

var mongoose = require('mongoose');
const { subscribe } = require('../app');

// scheama for users
var Schema = mongoose.Schema;

const usersSchema = new Schema({
      userName: String, 
      password: String,
      email: String, 
      subscribe: { type : Boolean }
  });

  const usersModel = mongoose.model("users", usersSchema);

 // save data to mongodatabase

const data ={
    userName: "Johanna456", 
    password: "johanna456", 
    email: "johanna456@outlook.com",
    subscribe: false
};

const newUser = new usersModel(data);

newUser.save((error)=> {
if (error) {
    console.log("something happened")
} else {
    console.log("Data has been saved");
}
}); 

// Print user information on admin page.
router.get('/', function(req, res, next) {
  usersModel.find({ })
  .then((data)=> {
    console.log("data:", data);
    let printUsers = "<div><h2>Användare</h2>"

for (user in data){
  printUsers += "<div><h3>" + data[user].userName +"</h3>"

  if (data[user].subscribe === true) {
    printUsers +=  "Prenumererar: Ja, Epostadress: " + data[user].email + "</p></div>"
  } else{
    printUsers += "Prenumererar: Nej</p></div>"
  }

    }
    printUsers += "</div>"
    
    res.send(printUsers);
  })
  .catch((error ) => {
    console.log("error:", daerrorta);
  });


});




module.exports = router;
