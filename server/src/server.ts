/**
 * Setup express server.
 */

import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";
import type { Request } from "express";

import { createExpressEndpoints, initServer } from "@ts-rest/express";
import { env } from "@/env.mjs";
import { api } from "@/contracts";
import auth from "~/routes/auth";
import user from "~/routes/user";

// **** Variables **** //

const app = express();


// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Show routes called in console during development
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security
if (env.NODE_ENV === "production") {
  app.use(helmet());
}

const s = initServer();

const router = s.router(api, {
  auth,
  user,
})

const apiRouter = express.Router()
app.use("/api", apiRouter)

// WORKAROUND: ts-rest does not allow to set cookies
apiRouter.all("*", (req: Request<Record<string,string>, unknown, { signature?: string }>, res, next) => {
  if (req.body.signature) {
    res.cookie("AUTH_TOKEN", req.body.signature);
  }
  return next();
});

createExpressEndpoints(api, router, apiRouter, { responseValidation: true });


// **** Export default **** //

export default app;
