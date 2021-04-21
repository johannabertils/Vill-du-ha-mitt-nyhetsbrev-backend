var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");

router.use(cors());


var mongoose = require('mongoose');

// scheama for users
var Schema = mongoose.Schema;

const usersSchema = new Schema({
  userName: String,
  password: String,
  email: String,
  subscribe: { type: Boolean }
});

const usersModel = mongoose.model("users", usersSchema);

// Print user information on admin page.
router.get('/', function (req, res, next) {
  usersModel.find({})
    .then((data) => {
      console.log("data:", data);
      let printUsers = "<div><h2>Användare</h2>"

      for (user in data) {
        printUsers += "<div><h3>" + data[user].userName + "</h3>"

        if (data[user].subscribe === true) {
          printUsers += "Prenumererar: Ja, Epostadress: " + data[user].email + "</p></div>"
        } else {
          printUsers += "Prenumererar: Nej</p></div>"
        }

      }
      printUsers += "</div>"

      res.send(printUsers);
    })
    .catch((error) => {
      console.log("error:", daerrorta);
    });

});

router.post("/new", function (req, res) {
  console.log("Ny användare sparad");
  newUserInfo = req.body.newUserInfo;
  console.log(newUserInfo);

  let data = {
    userName: newUserInfo.userName,
    password: newUserInfo.password,
    email: newUserInfo.email,
    subscribe: newUserInfo.subscribe
  };

  const newUser = new usersModel(data);

  newUser.save((error) => {
    if (error) {
      console.log("something happened")
    } else {
      console.log("Data has been saved");
    }
  });
});

router.post("/login", function (req, res) {
  console.log("Ny användare sparad");
  userInfo = req.body.userInfo;
  console.log(userInfo);

  const query = usersModel.findOne({ 'userName': userInfo.userName });

  query.select('userName password');

  query.exec(function (err, user) {
    if (user === null) {
      res.json({ fel:"fel användarnamn"});
      console.log("fel användarnamn");
    } else {
      console.log('%s %s', user.userName, user.password);

      if (userInfo.password === user.password){
        console.log("rätt lösenord");
        res.json({ inloggnad:"Inloggad"});
      } else {
        res.json({ fel:"fel lösenord"});
        console.log("fel lösenord");
      }
    }
  });
});


module.exports = router;