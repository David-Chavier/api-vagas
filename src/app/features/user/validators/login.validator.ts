import { NextFunction, Request, Response } from "express";
import { HttpResponse } from "../../../shared/util";
import { JwtService } from "../../../shared/services/jwt.service";

export class LoginValidator {
  public static checkLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return HttpResponse.fieldNotProvided(res, "Email");
      }
      if (!password) {
        return HttpResponse.fieldNotProvided(res, "Password");
      }

      next();
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        error: error.toString(),
      });
    }
  }

  public static checkToken(req: Request, res: Response, next: NextFunction) {
    try {
      // verificar se um token foi informado
      const token = req.headers.authorization;

      if (!token) {
        return HttpResponse.unauthorized(res);
      }

      // verificar se é um token válido
      const jwtService = new JwtService();
      const isValid = jwtService.verifyToken(token);

      if (!isValid) {
        return HttpResponse.unauthorized(res);
      }

      next();
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        error: error.toString(),
      });
    }
  }
}
