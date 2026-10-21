import sMySQL from "serverless-mysql";
import { envData } from "./vars";

export const dbConnection = sMySQL({
    config: {
        host: envData.DB_HOST,
        port: envData.DB_PORT,
        database: envData.DB_NAME,
        user: envData.DB_USER,
        password: envData.DB_PASSWORD,
    },
});

export default dbConnection;
