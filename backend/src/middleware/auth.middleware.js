import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRouter = async (req, res, next) => {
  try {
    //console.log("Cookies received in protectRouter:", req.cookies); // Debugging
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "unauthorized - no token provided" });
    }
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // if (!decoded) {
    //   return res.status(401).json({ message: "unauthorized - invalid token" });
    // }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }
      console.log("JWT verification error:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protect route middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
