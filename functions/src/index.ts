import * as functions from "firebase-functions";

import * as express from "express";
import * as bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.get("/healthcare", (req, res) => res.send("ok"));

app.post("/healthcare/metrics", (req, res) => {
  res.json(req.body);
});

export const healthcare = functions.region("us-central1").https.onRequest(app);
