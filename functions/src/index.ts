import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import * as express from "express";
import * as bodyParser from "body-parser";

import * as Ajv from "ajv";
import * as schema from "./schema.json";
import { DailyMetrics } from "./schema";

const firebase = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://sketch-cloud-vision.firebaseio.com"
});
const firestore = firebase.firestore();

const app = express();
app.use(bodyParser.json());

app.get("/healthcare", (req, res) => res.send("ok"));

const validate = new Ajv({ allErrors: true }).compile(
  schema.definitions.DailyMetrics
);

app.post("/healthcare/metrics", async (req, res) => {
  if (!validate(req.body)) {
    return res.status(400).json(validate.errors);
  }

  const metrics = req.body as DailyMetrics;

  await firestore
    .collection("battle")
    .doc(metrics.date)
    .collection("users")
    .doc(metrics.id)
    .set({
      ...metrics,
      _updatedAt: new Date()
    });

  return res.json(req.body);
});

export const healthcare = functions.region("us-central1").https.onRequest(app);
