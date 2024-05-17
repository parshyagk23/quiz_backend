const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({
        errormessage: "Bad request",
      });
    }
    const isExistUser = await User.findOne({ email });
    if (isExistUser) {
      return res.status(409).json({
        errormessage: "Username Already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const UserData = new User({
      username,
      email,
      password: hashedPassword,
    });
    await UserData.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    
    res.status(500).json({
      errorMessage: "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        errormessage: "Bad request",
      });
    }
    const UserDetails = await User.findOne({ email });
    if (!UserDetails) {
      return res.status(401).json({
        errormessage: "Invalid Credentials!!",
      });
    }
    const passwordMatches = await bcrypt.compare(
      password,
      UserDetails?.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        errormessage: "Invalid Credentials!!",
      });
    }

    const token = jwt.sign(
      {
        userId: UserDetails?._id,
        username: UserDetails?.username,
        email:UserDetails?.email
      },
      process.env.SECRET_CODE,
      { expiresIn: "24h" }
    );
    res.json({
      message: "User Login SuccessFully",
      token,
      username: UserDetails?.username,
      _id:UserDetails?._id,
      email:UserDetails?.email
    });
  } catch (error) {
    
    res.status(500).json({
      errorMessage: "Internal server error",
    });
  }
};

module.exports = { registerUser, loginUser };
