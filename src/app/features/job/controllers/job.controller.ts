import { Request, Response } from "express";
import { CreateJobUsecase } from "../usecases/create-job.usecasse";
import { HttpResponse } from "../../../shared/util";
import { ListCandidatesJob } from "../usecases/list-candidates-job.usecase";
import { ListAllJobs } from "../usecases/list-all-jobs.usecase";

export class JobController {
  public async create(req: Request, res: Response) {
    try {
      const idRecruiter = req.headers.loggedUserId;

      const result = await new CreateJobUsecase().execute({
        ...req.body,
        idRecruiter,
      });

      return res.status(result.code).send(result);
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public async listJob(req: Request, res: Response) {
    try {
      const usecase = new ListAllJobs();
      const result = await usecase.execute();

      return res.status(result.code).send(result);
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public async listJobById(req: Request, res: Response) {
    try {
      const { idJob } = req.params;
      const { loggedUserId } = req.headers;

      const usecase = new ListCandidatesJob();
      const result = await usecase.execute({
        idJob,
        idRecruiter: loggedUserId as string,
      });

      return res.status(result.code).send(result);
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }
}
