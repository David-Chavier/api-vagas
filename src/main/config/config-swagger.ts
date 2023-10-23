import express, { Response, Request, NextFunction } from "express";
import { serve, setup } from "swagger-ui-express";
import swaggerConfig from "../docs";

// const noCache = (_: Request, res: Response, next: NextFunction): void => {
//   res.set(
//     "cache-control",
//     "no-store, no-cache, must-revalidate, proxy-revalidate"
//   );
//   res.set("pragma", "no-cache");
//   res.set("expires", "0");
//   res.set("surrogate-control", "no-store");
//   next();
// };

export default (app: express.Application): void => {
  app.use("/docs", serve, setup(swaggerConfig));
};
