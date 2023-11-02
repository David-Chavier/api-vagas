import { Request, Response } from "express";
import { HttpResponse } from "../../../shared/util/http-response.adapter";
import { ListCandidateUsecase } from "../usecases/list-candidate.usecase";
import { CreateCandidateUsecase } from "../usecases/create-candidate.usecase";

export class CandidateController {
  public async create(req: Request, res: Response) {
    try {
      // 1 - parametros
      const { name, email, password } = req.body;

      // 2 - processamento = chama usecase
      const result = await new CreateCandidateUsecase().execute(req.body);

      // 3 - resposta
      return res.status(result.code).send(result);
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }
  public async list(req: Request, res: Response) {
    try {
      // 2 - processamento {data: Array}
      const result = await new ListCandidateUsecase().execute();

      // 3 - resposta
      return res.status(result.code).send(result);
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }
}
