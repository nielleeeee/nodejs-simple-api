export const fileChecker = (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (file.mimetype !== "text/plain") {
      return res.status(400).json({ message: "Invalid file type" });
    }

    const fileContent = file.buffer.toString("utf-8");
    const letterCount = fileContent.length;
    const wordCount = fileContent.split(/\s+/).filter(Boolean).length;

    return res
      .status(200)
      .json({ message: "File checked successfully", wordCount, letterCount });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
