import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

function loadRoutes() {
  const routesDir = path.join(__dirname, "routes");

  fs.readdirSync(routesDir).forEach((file) => {
    if (file === "index.ts" || file === "index.js") {
      const route = require(path.join(routesDir, file)).default;
      app.use("/", route);
    } else if (file.endsWith(".routes.ts") || file.endsWith(".routes.js")) {
      const routeName = `/${file
        .replace(".routes.ts", "")
        .replace(".routes.js", "")}`;
      const route = require(path.join(routesDir, file)).default;
      app.use(routeName, route);
    }
  });
}

loadRoutes();

export default app;
