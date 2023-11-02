import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { LoginUsecase } from "../../../../../src/app/features/user/usecases/login.usecase";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { User } from "../../../../../src/app/models/user.model";
import { UserType } from "../../../../../src/app/models/user-type.model";

describe("testando usecase de login de usuários", () => {
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
    return new LoginUsecase();
  };

  test("Deveria retornar erro 404 se o usuário não for encontrado no banco de dados", async () => {
    const sut = createSut();
    const user = new User(
      "any_name",
      "any_email",
      "any_password",
      UserType.Candidate,
      "any_enterprise"
    );

    jest
      .spyOn(UserRepository.prototype, "getByEmail")
      .mockResolvedValue(undefined);

    const result = await sut.execute({
      email: "any_email",
      password: "any_password",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(404);
    expect(result.ok).toEqual(false);
    expect(result).toHaveProperty("code", 404);
    expect(result.message).toBe("User not found");
  });

  test("Deveria retornar erro 401 se a senha do usuário estiver incorreta", async () => {
    const sut = createSut();
    const user = new User(
      "any_name",
      "any_email",
      "any_password",
      UserType.Candidate,
      "any_enterprise"
    );

    jest.spyOn(UserRepository.prototype, "getByEmail").mockResolvedValue(user);

    const result = await sut.execute({
      email: "any_email",
      password: "any_password_diferente",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(401);
    expect(result.ok).toEqual(false);
    expect(result).toHaveProperty("code", 401);
    expect(result.message).toBe("Invalid credentials");
  });

  test("Deveria retornar 200 se o usuário fizer login com sucesso", async () => {
    const sut = createSut();
    const user = new User(
      "any_name",
      "any_email",
      "any_password",
      UserType.Candidate,
      "any_enterprise"
    );

    jest.spyOn(UserRepository.prototype, "getByEmail").mockResolvedValue(user);

    const result = await sut.execute({
      email: "any_email",
      password: "any_password",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.ok).toEqual(true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toBe("Login successfully done");
    expect(result).toHaveProperty("data");
  });
});
