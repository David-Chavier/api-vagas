import { Database } from "../../../../../src/main/database/database.connection";
import { CacheDatabase } from "../../../../../src/main/database/redis.connection";
import { CreateJobApplicationUsecase } from "../../../../../src/app/features/job-application/usecases/create-job-application.usecase";
import { UserRepository } from "../../../../../src/app/features/user/repositories/user.repository";
import { UserType } from "../../../../../src/app/models/user-type.model";
import { Job } from "../../../../../src/app/models/job.model";
import { Recruiter } from "../../../../../src/app/models/recruiter.model";
import { User } from "../../../../../src/app/models/user.model";
import { JobRepository } from "../../../../../src/app/features/job/repositories/job.repository";
import { JobApplicationRepository } from "../../../../../src/app/features/job-application/repositories/job-application.repository";
import { JobApplication } from "../../../../../src/app/models/job-application.model";

describe("testando usecase de criação de aplicação para vaga", () => {
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
    return new CreateJobApplicationUsecase();
  };

  test("Deveria retornar erro 404 se o candidato não for encontrado", async () => {
    const sut = createSut();

    jest
      .spyOn(UserRepository.prototype, "getById")
      .mockResolvedValue(undefined);

    const result = await sut.execute({
      idCandidate: "any_idCandidate",
      idJob: "any_idJob",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(404);
    expect(result.ok).toEqual(false);
    expect(result).toHaveProperty("code", 404);
    expect(result.message).toBe("User not found");
    expect(result).not.toHaveProperty("data");
  });

  test("Deveria retornar erro 404 se a vaga não for encontrada", async () => {
    const sut = createSut();
    const user = new User(
      "any_name",
      "any_email",
      "any_password",
      UserType.Candidate,
      "any_enterprise"
    );

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(user);
    jest
      .spyOn(JobRepository.prototype, "getById")
      .mockResolvedValue({ undefined });

    const result = await sut.execute({
      idCandidate: "any_idCandidate",
      idJob: "any_idJob",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(404);
    expect(result.ok).toEqual(false);
    expect(result).toHaveProperty("code", 404);
    expect(result.message).toBe("Job not found");
    expect(result).not.toHaveProperty("data");
  });

  test("Deveria retornar erro 400 se já tiver passado da data limite", async () => {
    const sut = createSut();
    const user = new User(
      "any_name",
      "any_email",
      "any_password",
      UserType.Candidate,
      "any_enterprise"
    );

    const dataLimit = new Date("2021-11-01");

    const job = new Job(
      "any_description",
      "any_enterprise",
      dataLimit,
      true,
      new Recruiter("any_name", "any_email", "any_password", "any_enterprise")
    );

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(user);
    jest.spyOn(JobRepository.prototype, "getById").mockResolvedValue({ job });

    const result = await sut.execute({
      idCandidate: "any_idCandidate",
      idJob: "any_idJob",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(400);
    expect(result.ok).toEqual(false);
    expect(result).toHaveProperty("code", 400);
    expect(result.message).toBe(
      "Deadline is invalid: Job is not accepting applications anymore"
    );
    expect(result).not.toHaveProperty("data");
  });

  test("Deveria retornar erro 400 se a vaga não estiver ativa", async () => {
    const sut = createSut();
    const user = new User(
      "any_name",
      "any_email",
      "any_password",
      UserType.Candidate,
      "any_enterprise"
    );

    const dataLimit = new Date("2024-11-01");

    const job = new Job(
      "any_description",
      "any_enterprise",
      dataLimit,
      false,
      new Recruiter("any_name", "any_email", "any_password", "any_enterprise")
    );

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(user);
    jest.spyOn(JobRepository.prototype, "getById").mockResolvedValue({ job });

    const result = await sut.execute({
      idCandidate: "any_idCandidate",
      idJob: "any_idJob",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(400);
    expect(result.ok).toEqual(false);
    expect(result).toHaveProperty("code", 400);
    expect(result.message).toBe("Job is invalid: Job is inactive");
    expect(result).not.toHaveProperty("data");
  });

  test("Deveria retornar erro 400 se a vaga já tiver atingido o limite de candidatos", async () => {
    const sut = createSut();
    const user = new User(
      "any_name",
      "any_email",
      "any_password",
      UserType.Candidate,
      "any_enterprise"
    );

    const dataLimit = new Date("2024-11-01");

    const job = new Job(
      "any_description",
      "any_enterprise",
      dataLimit,
      true,
      new Recruiter("any_name", "any_email", "any_password", "any_enterprise"),
      1
    );

    const jobApplication = new JobApplication(user, job, new Date());

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(user);
    jest.spyOn(JobRepository.prototype, "getById").mockResolvedValue({ job });
    jest
      .spyOn(JobApplicationRepository.prototype, "listByJobId")
      .mockResolvedValue([jobApplication, jobApplication]);

    const result = await sut.execute({
      idCandidate: "any_idCandidate",
      idJob: "any_idJob",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(400);
    expect(result.ok).toEqual(false);
    expect(result).toHaveProperty("code", 400);
    expect(result.message).toBe(
      "Job is invalid: Job applications already fullfiled"
    );
    expect(result).not.toHaveProperty("data");
  });

  test("Deveria retornar erro 400 se o candidato já tiver aplicado para a vaga", async () => {
    const sut = createSut();
    const user = new User(
      "any_name",
      "any_email",
      "any_password",
      UserType.Candidate,
      "any_enterprise"
    );

    const dataLimit = new Date("2024-11-01");

    const job = new Job(
      "any_description",
      "any_enterprise",
      dataLimit,
      true,
      new Recruiter("any_name", "any_email", "any_password", "any_enterprise"),
      6
    );

    const jobApplication = new JobApplication(user, job, new Date());

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(user);
    jest.spyOn(JobRepository.prototype, "getById").mockResolvedValue({ job });
    jest
      .spyOn(JobApplicationRepository.prototype, "listByJobId")
      .mockResolvedValue([jobApplication, jobApplication]);

    const result = await sut.execute({
      idCandidate: user.id,
      idJob: "any_idJob",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(400);
    expect(result.ok).toEqual(false);
    expect(result).toHaveProperty("code", 400);
    expect(result.message).toBe(
      "Candidate is invalid: Candidate already subscribed"
    );
    expect(result).not.toHaveProperty("data");
  });

  test("Deveria retornar erro 200 se for criado a aplicação para a vaga", async () => {
    const sut = createSut();
    const user = new User(
      "any_name",
      "any_email",
      "any_password",
      UserType.Candidate,
      "any_enterprise"
    );

    const dataLimit = new Date("2024-11-01");

    const job = new Job(
      "any_description",
      "any_enterprise",
      dataLimit,
      true,
      new Recruiter("any_name", "any_email", "any_password", "any_enterprise"),
      6
    );

    const jobApplication = new JobApplication(user, job, new Date());

    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(user);
    jest.spyOn(JobRepository.prototype, "getById").mockResolvedValue({ job });
    jest
      .spyOn(JobApplicationRepository.prototype, "listByJobId")
      .mockResolvedValue([]);
    jest
      .spyOn(JobApplicationRepository.prototype, "create")
      .mockResolvedValue();

    const result = await sut.execute({
      idCandidate: "any_idCandidate",
      idJob: "any_idJob",
    });

    expect(result).toBeDefined();
    expect(result.code).toBe(200);
    expect(result.ok).toEqual(true);
    expect(result).toHaveProperty("code", 200);
    expect(result.message).toBe("Job Application successfully created");
    expect(result).toHaveProperty("data");
  });
});
