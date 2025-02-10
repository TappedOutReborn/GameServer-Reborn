import { Router } from "express";

import gamesController from "./mhRoutes/games/games.controller.js";
import gameplayconfigController from "./mhRoutes/gameplayconfig/gameplayconfig.controller.js";
import usersController from "./mhRoutes/users/users.controller.js";
import userstatsController from "./mhRoutes/userstats/userstats.controller.js";
import linkController from "./mhRoutes/link/link.controller.js";
import clienttelemetryController from "./mhRoutes/clienttelemetry/clienttelemetry.controller.js";
import adminRouter from "./mhRoutes/admin/admin.controller.js";

import androidController from "./directorRoutes/android/android.controller.js";

import probeController from "./authRoutes/probe/probe.controller.js";
import connectController from "./authRoutes/connect/connect.controller.js";

import identityController from "./proxyRoutes/identity/identity.controller.js";

const apiMh = Router()
  .use("/games", gamesController)
  .use("/gameplayconfig", gameplayconfigController)
  .use("/users", usersController)
  .use("/userstats", userstatsController)
  .use("/link", linkController)
  .use("/clienttelemetry", clienttelemetryController)
  .use("/mh/admin", adminRouter);

const apiDirector = Router().use("/android", androidController);

const apiAuth = Router()
  .use("/probe", probeController)
  .use("/connect", connectController);

const apiProxy = Router().use("/identity", identityController);

export default Router()
  .use("/mh", apiMh)
  .use("/director/api", apiDirector)
  .use("/", apiAuth)
  .use("/proxy", apiProxy)
  .use(
    "//proxy",
    apiProxy,
  ) /* //proxy/identity/geoagerequirements?client_id=simpsons4-android-client  */;
