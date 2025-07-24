import webhooks from "./routes/webhooks";

export default function (app) {
  webhooks(app);
  // You can add more custom routes here
  return app;
}
