const express = require('express');
const router = express.Router();

const {displayExpense} = require("../controllers/displayexpenseController")
router.get("/:gid", displayExpense);



module.exports  = router;