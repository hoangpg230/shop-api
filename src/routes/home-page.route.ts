import express from "express";
import bannerController from "../controllers/banner.controller";
import { verifyAccessToken } from "../utils/jwt";

const router = express.Router();

router.get("/banner", bannerController.bannerController);
router.post("/banner", verifyAccessToken, bannerController.updateBanner);
export default router;
