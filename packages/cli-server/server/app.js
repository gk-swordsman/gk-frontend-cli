import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import history from "connect-history-api-fallback";
import indexRouter from "./routes/index";
import folderRouter from "./routes/folder";
import presetRouter from "./routes/preset";
import templateRouter from "./routes/template";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var app = express();
app.use(history());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
if (process.env.NODE_ENV === "production") {
  const staticDic = path.join(__dirname, "../cli-ui");
  console.log("staticDic", staticDic);
  app.use(express.static(staticDic));
}

app.use("/", indexRouter);
app.use("/folder", folderRouter);
app.use("/preset", presetRouter);
app.use("/template", templateRouter);
export default app;
