const express = require("express");

const router = express.Router();

//@api      GET
//des       user route
//access    Public

router.get("/", (req, res) => res.send("user route"));

module.exports = router;
