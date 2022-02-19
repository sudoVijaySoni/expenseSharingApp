const express = require("express");
const router = express.Router();

//require controllers
const {fetchUser, createuser} = require('../controllers/userController');

//defining routes
router.post("/createuser",createuser );
router.get("/",fetchUser );

//exporting router
module.exports = router;