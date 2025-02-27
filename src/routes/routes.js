import { Router } from "express";

import gamesController from "./mhRoutes/games/games.controller.js";
import gameplayconfigController from "./mhRoutes/gameplayconfig/gameplayconfig.controller.js";
import usersController from "./mhRoutes/users/users.controller.js";
import userstatsController from "./mhRoutes/userstats/userstats.controller.js";
import linkController from "./mhRoutes/link/link.controller.js";
import clienttelemetryController from "./mhRoutes/clienttelemetry/clienttelemetry.controller.js";

import directorPlatformController from "./directorRoutes/platform/platform.controller.js";

import userPlatformController from "./userRoutes/platform/platform.controller.js";

import probeController from "./authRoutes/probe/probe.controller.js";
import connectController from "./authRoutes/connect/connect.controller.js";

import identityController from "./proxyRoutes/identity/identity.controller.js";

import trackingApiController from "./trackingRoutes/api/api.controller.js";

const apiMh = Router()
  .use("/games", gamesController)
  .use("/gameplayconfig", gameplayconfigController)
  .use("/users", usersController)
  .use("/userstats", userstatsController)
  .use("/link", linkController)
  .use("/clienttelemetry", clienttelemetryController);

const apiDirector = Router().use("/", directorPlatformController);

const apiUser = Router().use("/", userPlatformController);

const apiAuth = Router()
  .use("/probe", probeController)
  .use("/connect", connectController);

const apiProxy = Router().use("/identity", identityController);

const apiTrackingApi = Router().use("/", trackingApiController);

export default Router()
  .use("/mh", apiMh)
  .use("/director/api", apiDirector)
  .use("/user/api", apiUser)
  .use("/", apiAuth)
  .use("/proxy", apiProxy)
  .use(
    "//proxy",
    apiProxy,
  ) /* //proxy/identity/geoagerequirements?client_id=simpsons4-android-client  */
  .use("/tracking/api", apiTrackingApi);
