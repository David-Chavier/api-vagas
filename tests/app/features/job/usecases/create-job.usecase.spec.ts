import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { CreateJobUsecase } from "../../../../../src/app/features/job/usecases/create-job.usecasse";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserType } from "../../../../../src/app/models/user-type.model";
import { Job } from "../../../../../src/app/models/job.model";
import { Recruiter } from "../../../../../src/app/models/recruiter.model";
import { User } from "../../../../../src/app/models/user.model";
import { JobRepository } from "../../../../../src/app/features/job/repositories/job.repository";

describe("testando usecase de criação de vaga", () => {
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
    return new CreateJobUsecase();
  };

  test("Deveria retornar erro 404 se o recrutador não existir no banco de dados", async () => {
    const sut = createSut();

    jest
      .spyOn(UserRepository.prototype, "getById")
      .mockResolvedValue(undefined);

    const result = await sut.execute({
      description: "Vaga Junior HTML, CSS",
      enterprise: "Growdev SA",
      limitDate: new Date(),
      isActive: true,
      recruiterId: "any_recruiterId",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(404);
    expect(result.ok).toEqual(false);
    expect(result).toHaveProperty("code", 404);
    expect(result.message).toBe("Recruiter not found");
    expect(result).not.toHaveProperty("data");
  });

  test("Deveria retornar erro 201 se a vaga for criada", async () => {
    const sut = createSut();

    const user = new User(
      "any_name",
      "any_email",
      "any_password",
      UserType.Recruiter,
      "any_enterprise"
    );

    const job = new Job(
      "any_description",
      "any_enterprise",
      new Date(),
      true,
      new Recruiter("any_name", "any_email", "any_password", "any_enterprise")
    );

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(user);
    jest.spyOn(JobRepository.prototype, "create").mockResolvedValue();

    const result = await sut.execute({
      description: "Vaga Junior HTML, CSS",
      enterprise: "Growdev SA",
      limitDate: new Date(),
      isActive: true,
      recruiterId: "8e78a2db-2a68-4878-983c-3111e95c4c7b",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(201);
    expect(result.ok).toEqual(true);
    expect(result).toHaveProperty("code", 201);
    expect(result.message).toBe("Job successfully created");
    expect(result).not.toHaveProperty("data");
  });
});
