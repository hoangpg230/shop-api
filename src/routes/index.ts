import express from "express";

import authRoute from "./auth.route";
import homePageRoute from "./home-page.route";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/home-page",
    route: homePageRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
