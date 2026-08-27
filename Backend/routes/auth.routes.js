import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import User from "../models/user.model.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import validateRegister from "../middleware/validateRegister.middleware.js";
import validateLogin from "../middleware/validateLogin.middleware.js"

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 */
router.post("/register", validateRegister, registerUser);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 */
router.post("/login", validateLogin, loginUser);

/**
 * @openapi
 * /api/auth/profile:
 *   get:
 *     summary: Get authenticated user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user returned
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("name email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "You are authenticated",
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
