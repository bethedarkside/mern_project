const express = require("express");

const router = express.Router();

//@api      GET
//des       Profile route
//access    private

router.get("/", (req, res) => res.send("profile route"));

module.exports = router;
