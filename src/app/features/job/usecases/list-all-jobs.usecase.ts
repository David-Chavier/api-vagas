import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Result, Usecase, UsecaseResponse } from "../../../shared/util";
import { JobRepository } from "../repositories/job.repository";

export class ListAllJobs implements Usecase {
  public async execute(): Promise<Result> {
    // 1 - buscar a vaga pelo id => repository

    const cacheRepository = new CacheRepository();
    const cacheResult = await cacheRepository.get(`jobs`);

    if (cacheResult) {
      return {
        ok: true,
        code: 200,
        message: "Jobs successfully listed (cache!)",
        data: cacheResult,
      };
    }

    const repository = new JobRepository();
    const resultJobs = await repository.getJobs();

    const result = resultJobs.map((job) => job!.toJson());

    if (!result) {
      return UsecaseResponse.notFound("Job");
    }

    await cacheRepository.set(`jobs`, result);

    return {
      ok: true,
      code: 200,
      message: "Jobs successfully listed listed",
      data: result,
    };
  }
}
