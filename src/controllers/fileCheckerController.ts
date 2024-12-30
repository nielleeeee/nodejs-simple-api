import { Request, Response } from "express";

export const fileChecker = (req: Request, res: Response): void => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    if (file.mimetype !== "text/plain") {
      res.status(400).json({ message: "Invalid file type" });
      return;
    }

    const fileContent = file.buffer.toString("utf-8");
    const letterCount = fileContent.length;
    const wordCount = fileContent.split(/\s+/).filter(Boolean).length;

    res
      .status(200)
      .json({ message: "File checked successfully", wordCount, letterCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
