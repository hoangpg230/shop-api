import express from "express";

import authController from "../controllers/auth.controller";
import { logout, refreshToken } from "../utils/jwt";

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/refreshToken", refreshToken);
router.post("/logout", logout);
export default router;
