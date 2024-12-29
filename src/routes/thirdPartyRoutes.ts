import express from "express";
import { fetchThirdPartyData } from "../controllers/fetchThirdPartyController";

const router = express.Router();

router.post("/", (req: express.Request, res: express.Response) => {
  fetchThirdPartyData(req, res);
});

export default router;
