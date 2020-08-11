const express = require("express");

const router = express.Router();

//@api      post
//des       posts route
//access    Private

router.get("/", (req, res) => res.send("post route"));

module.exports = router;
