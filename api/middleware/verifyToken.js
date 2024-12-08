import jwt from "jsonwebtoken";
import { errorHandler } from "../util/errorHandler.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return next(errorHandler(401, "Not Authorized!"));

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) return next(errorHandler(403, "Token is not valid!"));
    req.userId = payload.id;
    next();
  });
};
