var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");

router.use(cors());


var mongoose = require('mongoose');
const { subscribe } = require('.');

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

// -------- register new user ------------------------

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


// checking if password and usernamne is correct
router.post("/login", function (req, res) {
  console.log("Ny användare sparad");
  userInfo = req.body.userInfo;
  console.log(userInfo);

  const query = usersModel.findOne({ 'userName': userInfo.userName });

  query.select('userName password _id');

  query.exec(function (err, user) {
    if (user === null) {
      res.json("error");
      console.log("fel användarnamn");
    } else {
      console.log('%s %s', user.userName, user.password, user._id);

      if (userInfo.password === user.password){
        console.log("rätt lösenord");
        res.json({
            loggedin: "yes",
            id: user._id
        });
      } else {
        res.json("error");
        console.log("fel lösenord");
      }
    }
  });
});

  // See if the user is subscribing to newsletter
  router.post("/login/user", function (req, res) {
    console.log("Funkar");
   id = req.body.id;
    console.log(id);

    const query = usersModel.findOne({ '_id': id });

    query.select('_id subscribe' );

    query.exec(function (err, user) {
        if (user.subscribe === true){
            res.json("true");
        console.log("user are subscribing");
    } else {
        res.json("false");
        console.log("user are not subscribing");
    }
    });
});

// Change subribtionstatus: Stop subscribing
router.post("/stop", function (req, res) {
    console.log("click på knapp");
    userId = req.body.id;
   changedStatus = req.body.changedStatus;
    console.log(changedStatus);
    console.log(userId);

    usersModel.findOneAndUpdate({_id: userId}, {$set:{subscribe:changedStatus}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        console.log(doc);
        res.json("Changed");
    });

});

module.exports = router;