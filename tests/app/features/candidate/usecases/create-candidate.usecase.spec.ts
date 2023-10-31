import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { CreateCandidateUsecase } from "../../../../../src/app/features/candidate/usecases/create-candidate.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserType } from "../../../../../src/app/models/user-type.model";
import { User } from "../../../../../src/app/models/user.model";

describe("testando usecase de criação de candidato", () => {
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
    return new CreateCandidateUsecase();
  };

  test("Deveria retornar erro 400 se já tiver o email no banco de dados", async () => {
    const sut = createSut();
    const user = new User(
      "any_name",
      "any_email",
      "any_password",
      UserType.Candidate
    );

    jest.spyOn(UserRepository.prototype, "getByEmail").mockResolvedValue(user);

    const result = await sut.execute({
      name: "any_name",
      email: "any_email",
      password: "any_password",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(400);
    expect(result.ok).toEqual(false);
    expect(result).toHaveProperty("code", 400);
    expect(result.message).toBe("User already exists");
    expect(result).not.toHaveProperty("data");
  });

  test("Deveria retornar 200 se o candidato for criado", async () => {
    const sut = createSut();

    jest
      .spyOn(UserRepository.prototype, "getByEmail")
      .mockResolvedValue(undefined);

    const result = await sut.execute({
      name: "any_name",
      email: "any_email",
      password: "any_password",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(201);
    expect(result.ok).toEqual(true);
    expect(result).toHaveProperty("code", 201);
    expect(result.message).toBe("Candidate successfully created");
  });
});
