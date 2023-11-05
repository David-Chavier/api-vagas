import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import supertest from "supertest";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { User } from "../../../../../src/app/models/user.model";
import { UserType } from "../../../../../src/app/models/user-type.model";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { JobEntity } from "../../../../../src/app/shared/database/entities/job.entity";

describe("testando criação de um candidato", () => {
  beforeAll(async () => {
    await Database.connect();
    await CacheDatabase.connect();
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

  const createUser = async (user: User) => {
    const repository = new UserRepository();
    await repository.create(user);
  };

  test("Deveria retornar erro 400 se o 'name' não for informado", async () => {
    const result = await supertest(sut).post(`/candidate`).send({
      email: "maria@gmailll.com",
      password: "senha123",
    });

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.status).toEqual(400);
    expect(result).toHaveProperty("status", 400);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("Name not provided");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 400 se o 'email' não for informado", async () => {
    const result = await supertest(sut).post(`/candidate`).send({
      name: "any_name",
      password: "senha123",
    });

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.status).toEqual(400);
    expect(result).toHaveProperty("status", 400);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("Email not provided");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 400 se o 'password' não for informado", async () => {
    const result = await supertest(sut).post(`/candidate`).send({
      name: "any_name",
      email: "maria@gmailll.com",
    });

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.status).toEqual(400);
    expect(result).toHaveProperty("status", 400);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("Password not provided");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 400 o candidato já existir no banco de dados", async () => {
    const user = new User(
      "any_name",
      "any_email",
      "any_password",
      UserType.Candidate,
      "any_enterprise"
    );
    await createUser(user);

    const result = await supertest(sut).post(`/candidate`).send({
      name: "any_name",
      email: "any_email",
      password: "any_password",
    });

    expect(result).toBeDefined();
    expect(result.status).toBe(400);
    expect(result.status).toEqual(400);
    expect(result).toHaveProperty("status", 400);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("User already exists");
    expect(result.body.ok).toBe(false);
  });

  test("Deveria retornar erro 200 se o usuário for criado", async () => {
    const result = await supertest(sut).post(`/candidate`).send({
      name: "any_name",
      email: "any_email",
      password: "any_password",
    });

    expect(result).toBeDefined();
    expect(result.status).toBe(201);
    expect(result.status).toEqual(201);
    expect(result).toHaveProperty("status", 201);
    expect(result).toHaveProperty("body.ok");
    expect(result.body.message).toBe("Candidate successfully created");
    expect(result.body.ok).toBe(false);
  });
});
