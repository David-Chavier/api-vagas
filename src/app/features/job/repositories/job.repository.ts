import { Database } from "../../../../main/database/database.connection";
import { Job } from "../../../models/job.model";
import { User } from "../../../models/user.model";
import { JobEntity } from "../../../shared/database/entities/job.entity";
import { UserRepository } from "../../user/repositories/user.repository";

export class JobRepository {
  private repository = Database.connection.getRepository(JobEntity);

  public async create(job: Job) {
    const entity = this.repository.create({
      id: job.id,
      description: job.description,
      enterprise: job.enterprise,
      limitDate: job.limitDate,
      isActive: job.isActive,
      idRecuiter: job.recruiter.id,
      maxCandidates: job.maxCandidates,
    });

    await this.repository.save(entity);
  }

  public async getById(id: string): Promise<any | undefined> {
    const result = await this.repository.findOne({
      where: {
        id,
      },
      relations: {
        recruiter: true,
        jobApplication: { candidate: true },
      },
    });

    return JobRepository.mapRowToModelCandidates(result);
  }

  public async getJobs(): Promise<(Job | undefined)[]> {
    const result = await this.repository.find();

    return result.map((job) => JobRepository.mapRowToModel(job));
  }

  public async list(idRecuiter: string): Promise<any> {
    const result = await this.repository.find({
      where: {
        idRecuiter,
      },
      relations: {
        recruiter: true,
        jobApplication: { candidate: true },
      },
    });

    return result.map((job) => JobRepository.mapRowToModel(job));
  }

  public static mapRowToModelCandidates(row: JobEntity | null) {
    if (!row) {
      return undefined;
    }

    const recruiter = UserRepository.mapRowToModel(row.recruiter);
    const job = Job.create(row, recruiter!);

    const candidates = row.jobApplication.map((row) =>
      UserRepository.mapRowToModel(row.candidate)
    ) as User[];

    return {
      job: job.toJson(),
      candidates: candidates.map((user) => user.toJson()),
    };
  }

  public static mapRowToModel(job?: JobEntity | undefined) {
    if (!job) {
      return undefined;
    }

    const recruiter = UserRepository.mapRowToModel(job.recruiter);

    return Job.create(job, recruiter!);
  }
}
