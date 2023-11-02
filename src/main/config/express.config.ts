import cors from "cors";
import express, { Request, Response } from "express";
import { recruiterRoutes } from "../../app/features/recruiter/routes/recruiter.routes";
import { loginRoutes } from "../../app/features/user/routes/login.routes";
import { candidateRoutes } from "../../app/features/candidate/routes/candidate.routes";
import { jobRoute } from "../../app/features/job/routes/job.routes";
import { jobApplicationRoutes } from "../../app/features/job-application/routes/job-application.routes";
import { serve, setup } from "swagger-ui-express";
import swaggerConfig from "../docs";

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.get("/", (req: Request, res: Response) =>
    res.status(200).json({ ok: true, message: "API JOBS" })
  );

  // ROUTES
  app.use("/recruiter", recruiterRoutes());
  app.use("/auth", loginRoutes());
  app.use("/candidate", candidateRoutes());
  app.use("/job", jobRoute());
  app.use("/application", jobApplicationRoutes());
  app.use("/docs", serve, setup(swaggerConfig));

  return app;
};
