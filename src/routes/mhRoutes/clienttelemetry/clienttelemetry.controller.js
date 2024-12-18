import { Router } from "express";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    res.status(200); // Ignore the request, but make the client know we received it
  } catch (error) {
    next(error);
  }
});

export default router;