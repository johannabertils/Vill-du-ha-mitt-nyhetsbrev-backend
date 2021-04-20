var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");

router.use(cors()); 

/* GET users listing. */
router.get('/', function (req, res, next) {

  req.app.locals.db.collection("users").find().toArray()
  .then(results => {
console.log(results);

let printUsers = "<div><h2>Våra users</h2>"

for (user in results){
  printUsers += "<div>" + results[user].firstName + "</div>"
    }
    printUsers += "</div>"
    
  res.send(printUsers);
})
});

router.post("/add", function(req,res) {

 req.app.locals.db.collection("users").insertOne(req.body)
 .then(result => {
   console.log(result);
   res.redirect("/show");
})
});




module.exports = router;
