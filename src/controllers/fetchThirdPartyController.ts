import { Request, Response } from "express";

export const fetchThirdPartyData = async (req: Request, res: Response) => {
  try {
    const rawData = await fetch(
      "https://64f4a6b7932537f4051a9111.mockapi.io/nielle/store-data"
    );
    const data = await rawData.json();

    return res.status(200).json({ message: "Fetching data from API", data });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
