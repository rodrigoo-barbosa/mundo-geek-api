import { DataSource } from "typeorm";
import 'dotenv/config';

export const appDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "123",
    database: process.env.DB_NAME || "mundo_geek",
    entities: ["src/entities/**/*.ts"],
    migrations: ["src/migrations/**/*.ts"],
    logging: process.env.NODE_ENV !== "production",
    synchronize: process.env.NODE_ENV !== "production",
});