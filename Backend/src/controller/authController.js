import argon2 from "argon2";
import db from "../DB/db.js";
import jwt from "jsonwebtoken";

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "None",
};

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(404).json({
        message: "Name, email and password are required.",
        success: false,
      });
    }

    const hashedPassword = await argon2.hash(password);

    const user = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    return res.status(201).json({
      message: "Registration Successful. Please login to continue.",
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in registerController:", error);
    return res.status(404).json({
      message: "Registration Failed. Please try again.",
      success: false,
    });
  }
};

const loginController = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({
        message: "Email address and password are required.",
        success: false,
      });
    }

    const existingUser = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser?.rows?.length === 0) {
      return res
        .status(401)
        .json({ message: "No such user found", success: false });
    }

    if (existingUser.rows[0].email !== email) {
      return res.status(401).json({
        message: "Invalid email. No such user found.",
        success: false,
      });
    }

    const user = existingUser.rows[0];

    const { id, name, email: emailAddress, created_at, updated_at } = user;

    const userPasswordInDB = user.password;

    const isPasswordCorrect = await argon2.verify(userPasswordInDB, password);

    if (isPasswordCorrect) {
      const token = jwt.sign(
        {
          id,
          emailAddress,
        },
        process.env.TOKEN_SECRET,
        {
          expiresIn: process.env.TOKEN_EXPIRY,
        }
      );

      if (!token) {
        console.error("Error generating token");
        return res.status(500).json({
          message: "Error while logging in. Please try again",
          success: false,
        });
      }

      if (token) {
        await db.query("UPDATE users SET is_logged_in = true WHERE id = $1", [
          user.id,
        ]);

        return res
          .status(200)
          .cookie("token", token, options)
          .json({
            message: "Login Successful",
            success: true,
            user: { id, name, email: emailAddress, created_at, updated_at },
          });
      }
    } else {
      return res.status(400).json({
        message:
          "Password incorrect. Please check your password and try again.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error in loginController:", error);
    return res.status(404).json({
      message:
        "Error validating your credentials. Please re-check your credentials.",
      success: false,
    });
  }
};

const logoutController = async function (req, res) {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({
        message: "Unauthorized. You're not allowed to perform this action.",
        success: false,
      });
    }

    await db.query("UPDATE users SET is_logged_in = false WHERE id = $1", [
      userId,
    ]);

    return res
      .status(200)
      .clearCookie("token", options)
      .json({ message: "Logout successful", success: true });
  } catch (error) {
    console.error("Error in logoutController controller: ", error);
    return res.status(400).json({
      message: "Error occurred while logging out. Please try again",
      success: false,
    });
  }
};

const userController = async function (req, res) {
  try {
    const userId = req.user.id;

    console.log("ID", userId);

    if (!userId) {
      return res.status(404).json({ message: "No user found", success: false });
    }

    const { rows, rowCount } = await db.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );

    if (rowCount === 0) {
      return res.status(403).json({
        message: "No such user found. Invalid request",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      success: true,
      user: rows[0],
    });
  } catch (error) {
    console.error("Error in userController controller:", error);
    return res.status(500).json({
      message: "Error occurred while fetching user information.",
      success: false,
    });
  }
};

export {
  registerController,
  loginController,
  logoutController,
  userController,
};
