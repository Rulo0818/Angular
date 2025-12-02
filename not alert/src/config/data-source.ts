import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Notificacion } from "../entities/Notificacion";
import { Alerta } from "../entities/Alerta";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Notificacion, Alerta],
    migrations: [],
    subscribers: [],
});

export const initDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Data Source initialized successfully!");
    } catch (err) {
        console.error("Error during initialization:", err);
    }
};
