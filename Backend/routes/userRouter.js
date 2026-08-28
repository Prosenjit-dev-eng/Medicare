import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  deleteUser,
} from "../controllers/userController.js";
import userAuth from "../middlewares/userAuth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", userAuth, getUserProfile);
userRouter.get("/", userAuth, getAllUsers);
userRouter.delete("/:id", userAuth, deleteUser);

export default userRouter;
