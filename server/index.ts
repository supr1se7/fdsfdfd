import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { registerRoutes } from "./routes";

const app = express();
const PORT = parseInt(process.env.PORT || "5000");

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function startServer() {
  try {
    // Register API routes
    const server = await registerRoutes(app);
    
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Seven Bots server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();