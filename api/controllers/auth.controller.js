import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../util/errorHandler.js";

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    //check if the user is already exist
    const existingUser = await User.findOne({ email });

    if (existingUser) return next(errorHandler(400, "Email  already exists!"));

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) return next(errorHandler(401, "Invalid Credentials!"));

    const isPasswordValid = bcryptjs.compareSync(
      password,
      existingUser.password
    );

    if (!isPasswordValid)
      return next(errorHandler(401, "Invalid Credentials!"));

    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: existingUser._id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: pass, ...otherInfo } = existingUser._doc;

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,
        //secure:true
      })
      .json(otherInfo);
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res, next) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User has been logged out!" });
};
