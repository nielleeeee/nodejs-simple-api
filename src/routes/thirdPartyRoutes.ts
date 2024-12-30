import express from "express";
import { fetchThirdPartyData } from "@/controllers/fetchThirdPartyController";

const router = express.Router();

router.post("/", fetchThirdPartyData);

export default router;
