import { Connection } from "jsstore";

const workerPath = process.env.NODE_ENV
  ? require("file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.js")
  : require("file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js");

export const connection = new Connection(new Worker(workerPath));
