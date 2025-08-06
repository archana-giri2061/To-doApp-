import { DataSource } from "typeorm";
import { User } from "./entity/user";
import { todolist } from "./entity/todo";
import dotenv from "dotenv";

dotenv.config();

export const tododb = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, todolist],
});
