import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { ListJobsApplication } from "../../../../../src/app/features/job-application/usecases/list-job-application.usecase";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { JobRepository } from "../../../../../src/app/features/job/repositories/job.repository";
import { JobApplicationRepository } from "../../../../../src/app/features/job-application/repositories/job-application.repository";

describe("testando usecase de listagem de vagas aplicadas pelo candidato", () => {
  beforeAll(async () => {
    await Database.connect();
    await CacheDatabase.connect();
  });

  afterAll(async () => {
    await Database.connection.destroy();
    await CacheDatabase.connection.quit();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const createSut = () => {
    return new ListJobsApplication();
  };

  test("Deveria retornar 200 se listar as vagas aplicadas pelo candidato em cache", async () => {
    const sut = createSut();

    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue("any_jobs");

    const result = await sut.execute("any_idCandidate");

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.ok).toEqual(true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toBe(
      "Jobs from the Job application successfully listed (cache!)"
    );
    expect(result).toHaveProperty("data");
  });

  test("Deveria retornar 200 se listar as vagas aplicadas pelo candidato no banco de dados", async () => {
    const sut = createSut();

    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(undefined);
    jest
      .spyOn(JobApplicationRepository.prototype, "listByCandidateId")
      .mockResolvedValue([]);

    const result = await sut.execute("any_idCandidate");

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.ok).toEqual(true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toBe(
      "Jobs from the Job application successfully listed"
    );
    expect(result).toHaveProperty("data");
  });
});
