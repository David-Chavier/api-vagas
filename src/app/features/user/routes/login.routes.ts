import { Router } from "express";
import { LoginController } from "../controllers/login.controller";
import { LoginValidator } from "../validators/login.validator";

export const loginRoutes = () => {
  const app = Router();

  app.post("/", LoginValidator.checkLogin, new LoginController().login);

  return app;
};
