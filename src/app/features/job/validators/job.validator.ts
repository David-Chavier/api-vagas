import { NextFunction, Request, Response } from "express";
import { JwtService } from "../../../shared/services/jwt.service";
import { HttpResponse } from "../../../shared/util";

export class JobValidator {
  public static checkCreateJob(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { description, enterprise, limitDate, isActive } = req.body;

      if (!description) {
        return HttpResponse.fieldNotProvided(res, "Description");
      }

      if (!enterprise) {
        return HttpResponse.fieldNotProvided(res, "enterprise");
      }

      if (!limitDate) {
        return HttpResponse.fieldNotProvided(res, "limitDate");
      }

      if (isActive === undefined) {
        return HttpResponse.fieldNotProvided(res, "isActive");
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
