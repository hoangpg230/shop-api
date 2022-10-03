import express from "express";

import authController from "../controllers/auth.controller";
import bannerController from "../controllers/banner.controller";
import { verifyAccessToken } from "../middlewares/authentication";
import { logout, refreshToken } from "../untils/jwt";
const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/banner", bannerController.bannerController);
router.post("/banner", verifyAccessToken, bannerController.updateBanner);
router.post("/refreshToken", refreshToken);
router.post("/logout", logout);
export default router;
