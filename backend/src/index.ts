import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.get("/", (req: Request, res: Response) => {
  res.json({
    msg: "Hello there",
  });
});

app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`),
);
