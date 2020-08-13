const express = require("express");
const { check, validationResult } = require("express-validator");
const User = require("../../modules/UserModel/User_model");

const jwt = require("jsonwebtoken");
const config = require("config");

const bcrypt = require("bcryptjs");

const router = express.Router();

//@route   POST
//desc     user route
//access   Public

router.post(
  "/",
  [
    check("name", "Name can not be empty").not().isEmpty(),
    check("email", "Email id must be a valid one !").isEmail(),
    check("password", "password must contain a minimum of 6 chars").isLength({
      min: 6,
    }),
    check("password", "password must contain a special chars and a number")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .matches(/\d/),
  ],
  async (req, res) => {
    //data validation
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    try {
      let { name, email, password } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: "User already exist" });
      }
      const slat = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, slat);

      user = new User({
        name,
        email,
        password,
      });
      await user.save();

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
