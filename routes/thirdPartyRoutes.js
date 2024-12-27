import express from "express";
import { fetchThirdPartyData } from "../controllers/fetchThirdPartyController.js";

const router = express.Router();

router.post("/", fetchThirdPartyData);

export default router;
