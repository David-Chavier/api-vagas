import { NextFunction, Request, Response } from "express";
import { JwtService } from "../../../shared/services/jwt.service";
import { HttpResponse } from "../../../shared/util";

export class RecruiterValidator {
  public static checkCreateRecruiter(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name, email, password, enterpriseName } = req.body;

      if (!name) {
        return HttpResponse.fieldNotProvided(res, "Name");
      }
      if (!email) {
        return HttpResponse.fieldNotProvided(res, "Email");
      }
      if (!password) {
        return HttpResponse.fieldNotProvided(res, "Password");
      }
      if (!enterpriseName) {
        return HttpResponse.fieldNotProvided(res, "Enterprise Name");
      }

      next();
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        error: error.toString(),
      });
    }
  }

  public static checkRecruiterToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = req.headers.authorization;

      const jwtService = new JwtService();
      const user = jwtService.decodeToken(token as string);

      if (user.type !== "R") {
        return HttpResponse.forbidden(res);
      }

      req.headers.loggedUserId = user.id;

      next();
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        error: error.toString(),
      });
    }
  }
}
