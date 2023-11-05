import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import supertest from "supertest";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { User } from "../../../../../src/app/models/user.model";
import { UserType } from "../../../../../src/app/models/user-type.model";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { JwtService } from "../../../../../src/app/shared/services/jwt.service";
import { CreateCandidateUsecase } from "../../../../../src/app/features/candidate/usecases/create-candidate.usecase";
import { LoginUsecase } from "../../../../../src/app/features/user/usecases/login.usecase";
import { CreateRecruiterUsecase } from "../../../../../src/app/features/recruiter/usecases/create-recruiter.usecase";
import { CacheRepository } from "../../../../../src/app/shared/database/repositories/cache.repository";
import { ListCandidateUsecase } from "../../../../../src/app/features/candidate/usecases/list-candidate.usecase";

const makeToken = async (): Promise<string> => {
  const createUser = await new CreateRecruiterUsecase().execute({
    name: "any_name",
    email: "any_email",
    password: "any_password",
    enterpriseName: "any_enterprise",
  });

  const userResult = await new LoginUsecase().execute({
    email: "any_email",
    password: "any_password",
  });

  const token = userResult.data.token;

  return token;
};

describe("testando criação de um candidato", () => {
  let token: string;

  beforeAll(async () => {
    await Database.connect();
    await CacheDatabase.connect();
    token = await makeToken();
  });

  afterAll(async () => {
    await Database.connection.destroy();
    await CacheDatabase.connection.quit();
  });

  afterEach(async () => {
    const userRepository = Database.connection.getRepository(UserEntity);

    await userRepository.clear();
  });

  const sut = createApp();

  // const createUser = async (user: User) => {
  //   const repository = new UserRepository();
  //   await repository.create(user);
  // };
  test("Deveria retornar erro 401 se o token não for informado", async () => {
    const result = await supertest(sut).get(`/candidate`).send();

    expect(result).toBeDefined();
    expect(result.status).toBe(401);
    expect(result.status).toEqual(401);
    expect(result).toHaveProperty("status", 401);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("Invalid credentials");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 401 se o token informado for invalido", async () => {
    const result = await supertest(sut)
      .get(`/candidate`)
      .set("Authorization", `token_invalido`)
      .send();

    expect(result).toBeDefined();
    expect(result.status).toBe(401);
    expect(result.status).toEqual(401);
    expect(result).toHaveProperty("status", 401);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("Invalid credentials");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 403 se o usuário não tiver autorização", async () => {
    await new CreateCandidateUsecase().execute({
      name: "any_name_candidate",
      email: "any_email_candidate",
      password: "any_password_candidate",
    });

    const userResult = await new LoginUsecase().execute({
      email: "any_email_candidate",
      password: "any_password_candidate",
    });

    const token = userResult.data.token;

    const result = await supertest(sut)
      .get(`/candidate`)
      .set("Authorization", `${token}`)
      .send();

    expect(result).toBeDefined();
    expect(result.status).toBe(403);
    expect(result.status).toEqual(403);
    expect(result).toHaveProperty("status", 403);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("User does not have the proper profile");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar 200 se os candidatos forem listados em cache", async () => {
    await new ListCandidateUsecase().execute();

    const result = await supertest(sut)
      .get(`/candidate`)
      .set("Authorization", `${token}`)
      .send();

    expect(result).toBeDefined();
    expect(result.status).toBe(200);
    expect(result.status).toEqual(200);
    expect(result).toHaveProperty("status", 200);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("Candidates successfully listed in cache");
    expect(result.body.ok).toBe(true);
  });

  test("Deveria retornar 200 se os candidatos forem listados", async () => {
    const cacheRepository = new CacheRepository();
    await cacheRepository.delete("candidates");

    const result = await supertest(sut)
      .get(`/candidate`)
      .set("Authorization", `${token}`)
      .send();

    expect(result).toBeDefined();
    expect(result.status).toBe(200);
    expect(result.status).toEqual(200);
    expect(result).toHaveProperty("status", 200);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("Candidates successfully listed");
    expect(result.body.ok).toBe(true);
  });
});
