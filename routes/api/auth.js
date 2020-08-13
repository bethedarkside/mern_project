const express = require("express");

const User = require("../../modules/UserModel/User_model");
const auth = require("../../modules/Auth/auth_middileware");
const { check, validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");
const config = require("config");

const bcrypt = require("bcryptjs");

const router = express.Router();

//@route     Get user
//@des       auth route
//@access    Private

router.get("/", auth, async (req, res) => {
  //   console.log(req.user.user_id);
  try {
    const user = await User.findById(req.user.user_id).select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

//@route     Post user
//@des       auth route
//@access    Private

router.post(
  "/",
  [
    check("email", "Email id must be a valid one !").isEmail(),
    check("password", "must Enter the password").not().isEmpty(),
  ],
  async (req, res) => {
    //data validation
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    try {
      let { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: "Invalid credentials" });
      }

      const payload = {
        user_id: user.id,
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          else {
            res.json({ token });
          }
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ errors: "Server error" });
    }
  }
);

module.exports = router;
