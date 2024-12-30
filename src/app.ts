import express from "express";
import todoRoutes from "@/routes/todoRoutes";
import fileRoutes from "@/routes/fileroutes";
import thirdPartyRoutes from "@/routes/thirdPartyRoutes";

const app = express();

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Simple Nodejs API");
});

app.use("/todo", todoRoutes);
app.use("/file", fileRoutes);
app.use("/third-party", thirdPartyRoutes);

export default app;
