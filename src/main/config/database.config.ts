import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

let config = new DataSource({
  type: "postgres",
  url: process.env.DB_URL,
  port: 5432,
  ssl: { rejectUnauthorized: false },
  migrations: ["src/app/shared/database/migrations/**/*.ts"],
  entities: ["src/app/shared/database/entities/**/*.ts"],
  schema: "vagas",
});

if (process.env.DB_ENV === "test") {
  config = new DataSource({
    type: "sqlite",
    database: "db.sqlite3",
    synchronize: false,
    entities: ["src/app/shared/database/entities/**/*.ts"],
    migrations: ["tests/app/shared/database/migrations/**/*.ts"],
  });
}

export default config;
