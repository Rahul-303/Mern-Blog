import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required!"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "password must be at least 6 characters"));
    }
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "username must be between 7 and 20 characters")
      );
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "username can only contains letters and numbers")
      );
    }
  }

  const userEmail = await User.findOne({ email });
  if (userEmail) {
    return next(errorHandler(400, "User already exist!"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json({ message: "sign up was successfull!" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required!"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(404, "Invalid Password!"));
    }

    const { password: pass, ...rest } = validUser._doc;
    const expiryDate = new Date(Date.now() + 3600000 * 24);
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        expires: expiryDate,
      })
      .json({ ...rest, message: "sign in was successful!" });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { username, email, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
      const { password: pass, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({ ...rest, message: "sign in using google was successful!" });
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const expiryDate = new Date(Date.now() + 3600000 * 24);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
      const { password: pass, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .json({ ...rest, message: "sign up using google was successfull!" });
    }
  } catch (error) {
    next(error);
  }
};
