import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { ListRecruitersUsecase } from "../../../../../src/app/features/recruiter/usecases/list-recruiters.usecase";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";

describe("testando usecase de listagem de recrutadores", () => {
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
    return new ListRecruitersUsecase();
  };

  test("Deveria retornar erro 200 se listar os recrutadores em cache", async () => {
    const sut = createSut();

    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue("any");

    const result = await sut.execute();

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.ok).toEqual(true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toBe("Recruiters successfully listed in cache");
  });

  test("Deveria retornar erro 200 se listar os recrutadores", async () => {
    const sut = createSut();

    jest.spyOn(CacheRepository.prototype, "get").mockResolvedValue(undefined);

    const result = await sut.execute();

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.ok).toEqual(true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toBe("Recruiters successfully listed");
  });
});
