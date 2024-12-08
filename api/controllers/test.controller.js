import { errorHandler } from "../util/errorHandler.js";
import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next(errorHandler(401, "Not Authenticated!"));
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return next(errorHandler(403, "Invalid Token"));
  });

  res.status(200).json({ message: "You are authenticated" });
};

export const shouldBeAdmin = async (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Not Authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return res.status(403).json({ message: "Token is not Valid!" });
    if (!payload.isAdmin)
      return res.status(403).json({ message: "Not authorized!" });
  });

  res.status(200).json({ message: "You are Authenticated and autho" });
};
