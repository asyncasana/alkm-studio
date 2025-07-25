const { MedusaApp } = require("@medusajs/framework");

module.exports = async (req, res) => {
  try {
    const app = await MedusaApp({
      directory: process.cwd(),
    });

    // Handle the request
    return app(req, res);
  } catch (error) {
    console.error("Medusa app error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
