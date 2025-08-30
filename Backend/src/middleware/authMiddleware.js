import jwt from "jsonwebtoken";
import db from "../DB/db.js";

const verifyJWT = async (req, res, next) => {
  try {
    const incomingToken =
      req.cookies.noteland_token ||
      req.body.noteland_token ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("token", incomingToken);

    if (!incomingToken) {
      return res
        .status(400)
        .json({ message: "Incoming token not found", success: false });
    }

    const decodedToken = jwt.verify(incomingToken, process.env.TOKEN_SECRET);

    const user = await db.query("SELECT * FROM users WHERE id = $1", [
      decodedToken?.id,
    ]);

    if (!user)
      return res.status(404).json({ message: "Unable to find a user.." });

    req.user = user.rows[0];

    next();
  } catch (error) {
    console.error("Error in Auth middleware:", error);
    return res.status(400).json({
      message: "Token Expired or missing",
      type: "TOKEN_FAILURE",
      success: false,
    });
  }
};

export default verifyJWT;
