var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");
var CryptoJS = require("crypto-js");

router.use(cors());


var mongoose = require('mongoose');
const { subscribe } = require('.');

// ------------------------ Create Schema of users ------------------------
var Schema = mongoose.Schema;

const usersSchema = new Schema({
    userName: String,
    password: String,
    email: String,
    subscribe: { type: Boolean }
});

const usersModel = mongoose.model("users", usersSchema);

// ------------------------ Adminpage ------------------------

router.get('/admin', function (req, res, next) {

    let inputField = `<div><h2>Logga in</h2>
    <form method="post">
    <div><input type="password" name="password"> Lösenord</div> 
    <div><button type="submit">spara</button></div></form></div>`;

    res.send(inputField);

});

router.post('/admin', function (req, res) {

    let password = req.body.password;
    console.log(req.body.password);
    let inputField = ``;
    if (password == "admin") {
        inputField += `<div><h2>Inloggad</h2></div>`;
        usersModel.find({})
            .then((data) => {
                console.log("data123:", data);
                inputField += `<div><h2>Användare</h2>`;

                for (user in data) {
                    inputField += `<div><h3>` + data[user].userName + `</h3>`;

                    if (data[user].subscribe === true) {
                        inputField += `Prenumererar: Ja, Epostadress: ` + data[user].email + `</p></div>`;
                    } else {
                        inputField += `Prenumererar: Nej</p></div>`;
                    }

                }
                inputField += `</div>`;
                res.send(inputField);

            })
            .catch((error) => {
                console.log(`error:`, daerrorta);
            });

    } else {
        inputField += `<div><h2>fel lösenord</h2></div>`;
        res.send(inputField);
    }

});

//------------------------ register new user ------------------------

router.post("/new", function (req, res) {
    console.log("Ny användare sparad");
    newUserInfo = req.body.newUserInfo;
    console.log(newUserInfo);

    let userPass = newUserInfo.password;
    console.log("pass" + userPass);
    let cryptoPass = CryptoJS.AES.encrypt(userPass, "Salt Nyckel").toString();

    console.log("new" + cryptoPass);
    let data = {
        userName: newUserInfo.userName,
        password: cryptoPass,
        email: newUserInfo.email,
        subscribe: newUserInfo.subscribe
    };

    const newUser = new usersModel(data);

    newUser.save((error) => {
        if (error) {
            console.log("something happened")
        } else {
            console.log("Data has been saved");
            res.json("User created");
        }
    });
});


// ------------------------checking if password and usernamne is correct ------------------------
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

            let originalPass = CryptoJS.AES.decrypt(user.password, "Salt Nyckel").toString(CryptoJS.enc.Utf8);

            console.log("user.password" + user.password);
            console.log("originalPass" + originalPass);


            if (userInfo.password === originalPass) {
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

//------------------------  See if the user is subscribing to newsletter ------------------------
router.post("/login/user", function (req, res) {
    console.log("Funkar");
    id = req.body.id;
    console.log(id);

    const query = usersModel.findOne({ '_id': id });

    query.select('_id subscribe');

    query.exec(function (err, user) {
        if (user.subscribe === true) {
            res.json("true");
            console.log("user are subscribing");
        } else {
            res.json("false");
            console.log("user are not subscribing");
        }
    });
});

// ------------------------ Change status of subscribtion ------------------------
router.post("/changestatus", function (req, res) {
    console.log("click på knapp");
    userId = req.body.id;
    changedStatus = req.body.changedStatus;
    console.log(changedStatus);
    console.log(userId);

    usersModel.findOneAndUpdate({ _id: userId }, { $set: { subscribe: changedStatus } }, { new: true }, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        console.log(doc);
        res.json("Changed");
    });

});

module.exports = router;