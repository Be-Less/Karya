import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import validateRegister from "../middleware/validateRegister.middleware.js";
import validateLogin from "../middleware/validateLogin.middleware.js"

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login",validateLogin, loginUser);
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

export default router;
