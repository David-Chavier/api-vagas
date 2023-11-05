import { MigrationInterface, QueryRunner } from "typeorm";

export class TestMigration1699131844877 implements MigrationInterface {
    name = 'TestMigration1699131844877'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "jobs" ("id" varchar PRIMARY KEY NOT NULL, "description" varchar NOT NULL, "enterprise" varchar NOT NULL, "limit_date" datetime NOT NULL, "is_active" boolean NOT NULL, "id_recruiter" varchar NOT NULL, "max_candidates" integer, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "type" varchar CHECK( "type" IN ('A','C','R') ) NOT NULL, "enterprise_name" varchar, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "jobs_applications" ("id_candidate" varchar NOT NULL, "id_job" varchar NOT NULL, "date" datetime NOT NULL, "success" boolean NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), PRIMARY KEY ("id_candidate", "id_job"))`);
        await queryRunner.query(`CREATE TABLE "temporary_jobs" ("id" varchar PRIMARY KEY NOT NULL, "description" varchar NOT NULL, "enterprise" varchar NOT NULL, "limit_date" datetime NOT NULL, "is_active" boolean NOT NULL, "id_recruiter" varchar NOT NULL, "max_candidates" integer, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_6dd5c65ff0ae0adfd676e58ecef" FOREIGN KEY ("id_recruiter") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_jobs"("id", "description", "enterprise", "limit_date", "is_active", "id_recruiter", "max_candidates", "created_at", "updated_at") SELECT "id", "description", "enterprise", "limit_date", "is_active", "id_recruiter", "max_candidates", "created_at", "updated_at" FROM "jobs"`);
        await queryRunner.query(`DROP TABLE "jobs"`);
        await queryRunner.query(`ALTER TABLE "temporary_jobs" RENAME TO "jobs"`);
        await queryRunner.query(`CREATE TABLE "temporary_jobs_applications" ("id_candidate" varchar NOT NULL, "id_job" varchar NOT NULL, "date" datetime NOT NULL, "success" boolean NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_4dfab5ceb8e82046d8b1835c845" FOREIGN KEY ("id_candidate") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7e3c70eec94d0fc10d03a984c61" FOREIGN KEY ("id_job") REFERENCES "jobs" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("id_candidate", "id_job"))`);
        await queryRunner.query(`INSERT INTO "temporary_jobs_applications"("id_candidate", "id_job", "date", "success", "created_at", "updated_at") SELECT "id_candidate", "id_job", "date", "success", "created_at", "updated_at" FROM "jobs_applications"`);
        await queryRunner.query(`DROP TABLE "jobs_applications"`);
        await queryRunner.query(`ALTER TABLE "temporary_jobs_applications" RENAME TO "jobs_applications"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "jobs_applications" RENAME TO "temporary_jobs_applications"`);
        await queryRunner.query(`CREATE TABLE "jobs_applications" ("id_candidate" varchar NOT NULL, "id_job" varchar NOT NULL, "date" datetime NOT NULL, "success" boolean NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), PRIMARY KEY ("id_candidate", "id_job"))`);
        await queryRunner.query(`INSERT INTO "jobs_applications"("id_candidate", "id_job", "date", "success", "created_at", "updated_at") SELECT "id_candidate", "id_job", "date", "success", "created_at", "updated_at" FROM "temporary_jobs_applications"`);
        await queryRunner.query(`DROP TABLE "temporary_jobs_applications"`);
        await queryRunner.query(`ALTER TABLE "jobs" RENAME TO "temporary_jobs"`);
        await queryRunner.query(`CREATE TABLE "jobs" ("id" varchar PRIMARY KEY NOT NULL, "description" varchar NOT NULL, "enterprise" varchar NOT NULL, "limit_date" datetime NOT NULL, "is_active" boolean NOT NULL, "id_recruiter" varchar NOT NULL, "max_candidates" integer, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "jobs"("id", "description", "enterprise", "limit_date", "is_active", "id_recruiter", "max_candidates", "created_at", "updated_at") SELECT "id", "description", "enterprise", "limit_date", "is_active", "id_recruiter", "max_candidates", "created_at", "updated_at" FROM "temporary_jobs"`);
        await queryRunner.query(`DROP TABLE "temporary_jobs"`);
        await queryRunner.query(`DROP TABLE "jobs_applications"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "jobs"`);
    }

}
