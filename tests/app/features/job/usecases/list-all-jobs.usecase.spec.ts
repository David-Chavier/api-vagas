import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { ListAllJobs } from "../../../../../src/app/features/job/usecases/list-all-jobs.usecase";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";

describe("testando usecase de listagem de todas as vagas", () => {
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
    return new ListAllJobs();
  };

  test("Deveria retornar 200 se listar as vagas salvas em cache", async () => {
    const sut = createSut();

    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue("any_vagas");

    const result = await sut.execute();

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.ok).toEqual(true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toBe("Jobs successfully listed (cache!)");
  });

  test("Deveria retornar 200 se listar as vagas salvas no banco de dados", async () => {
    const sut = createSut();

    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(undefined);

    const result = await sut.execute();

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.ok).toEqual(true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toBe("Jobs successfully listed");
  });
});
