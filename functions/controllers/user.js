const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.signup = async (req, res) => {
  const { email, password, username } = req.body;
  console.log(email)

  try {

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        email,
        password: hashedPassword,
        username,
      });
      await newUser.save();

      res.status(201).json({ message: "User created" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  User.findOne({ email: email })
    .then((user) => {
      if (user === null) {
        res.status(401).json({ message: "user not found" });
      } else {
        bcrypt
          .compare(password, user.password)
          .then((valid) => {
            if (!valid) {
              console.log("password not valid");
              res.status(401).json({ message: "password not valid" });
            } else {
              res.status(200).json({
                userId: user._id,
                username: user.username,
                token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                  expiresIn: "24h",
                }),
                isAdmin: user.isAdmin,
              });
            }
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
