import express from "express";
import { fileChecker } from "@/controllers/fileCheckerController";
import multer from "multer";

const router = express.Router();

const upload = multer();

router.post("/", upload.single("file"), (req: express.Request, res: express.Response) => {
  fileChecker(req, res);
});

export default router;
