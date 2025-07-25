const { loadEnv } = require("@medusajs/framework/utils");
const { MedusaApp } = require("@medusajs/framework");

// Load environment variables
loadEnv(process.env.NODE_ENV || "production", process.cwd());

let app;

async function createServer() {
  if (!app) {
    const medusaApp = await MedusaApp({
      directory: process.cwd(),
    });

    app = medusaApp.listen(process.env.PORT || 9000, () => {
      console.log("Medusa server is running");
    });
  }
  return app;
}

// Export for Vercel
module.exports = async (req, res) => {
  const server = await createServer();
  return server(req, res);
};
