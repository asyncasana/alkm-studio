import express, { Router } from "express";

const route = Router();

// Stripe webhook endpoint for Medusa v2
route.post("/stripe", express.raw({ type: "application/json" }), (req, res) => {
  // Log the raw body for debugging
  console.log("🔔 Stripe webhook received:", req.body);
  res.status(200).send("ok");
});

export default (app) => {
  app.use("/webhooks", route);
  return app;
};
