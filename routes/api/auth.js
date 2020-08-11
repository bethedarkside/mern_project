const express = require("express");

const router = express.Router();

//@api      post
//des       auth route
//access    Public

router.get("/", (req, res) => res.send("auth route"));

module.exports = router;
