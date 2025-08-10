import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
  userController,
} from "../controller/authController.js";
import verifyJWT from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/logout", verifyJWT, logoutController);
authRouter.get("/get-user", verifyJWT, userController);

export default authRouter;
