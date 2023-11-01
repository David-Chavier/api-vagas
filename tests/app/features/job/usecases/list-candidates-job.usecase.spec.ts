import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { ListCandidatesJob } from "../../../../../src/app/features/job/usecases/list-candidates-job.usecase";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { JobRepository } from "../../../../../src/app/features/job/repositories/job.repository";

describe("testando usecase de listagem de candidatos por vagas", () => {
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
    return new ListCandidatesJob();
  };

  test("Deveria retornar 200 se listar os candidatos para a vaga salvos em cache", async () => {
    const sut = createSut();

    jest
      .spyOn(CacheRepository.prototype, "get")
      .mockResolvedValue("any_candidates");

    const result = await sut.execute({
      idRecruiter: "any_idRecruiter",
      idJob: "any_idJob",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.ok).toEqual(true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toBe(
      "Candidates from the Job application successfully listed (cache!)"
    );
  });

  test("Deveria retornar 401 o recrutador logado for diferente do recrutador que criou a vaga", async () => {
    const sut = createSut();

    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(undefined);

    jest
      .spyOn(JobRepository.prototype, "getById")
      .mockResolvedValue({ job: { idRecruiter: "any_idRecruiter_diferente" } });

    const result = await sut.execute({
      idRecruiter: "any_idRecruiter",
      idJob: "any_idJob",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(401);
    expect(result.ok).toEqual(false);
    expect(result).toHaveProperty("code", 401);
    expect(result.message).toBe("Invalid credentials");
  });

  test("Deveria retornar 200 os candidatos para a vaga forem listados", async () => {
    const sut = createSut();

    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(undefined);

    jest
      .spyOn(JobRepository.prototype, "getById")
      .mockResolvedValue({ job: { idRecruiter: "any_idRecruiter" } });

    const result = await sut.execute({
      idRecruiter: "any_idRecruiter",
      idJob: "any_idJob",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.ok).toEqual(true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toBe(
      "Candidates from the Job application successfully listed"
    );
  });
});
