const express = require("express");
const router = express.Router();

//require controllers
const {split} = require('../controllers/splitbillController');

//defining routes
router.post('/', split)

//exporting router
module.exports=router;