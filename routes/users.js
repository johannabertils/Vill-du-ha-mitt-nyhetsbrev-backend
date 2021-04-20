var express = require('express');
var router = express.Router();
const fs = require("fs");
const cors = require("cors");

router.use(cors()); 

/* GET users listing. */
router.get('/', function (req, res, next) {

  fs.readFile("users.json", function (err, data) {
    if (err) {
      console.log(err);
    }

    let users = JSON.parse(data);

    res.json(users);
  });

});

module.exports = router;
