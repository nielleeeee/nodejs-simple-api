import express from "express";
import { fileChecker } from "../controllers/fileCheckerController.js";
import multer from "multer";

const router = express.Router();

const upload = multer();

router.post("/", upload.single("file"), fileChecker);

export default router;
