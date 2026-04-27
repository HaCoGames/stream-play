import mongoose from "mongoose";
import logger from "../logger/logger.ts";
import DEFAULTS from "../config/DEFAULTS.ts";

const dbConnectionTimeout:number = DEFAULTS.MONGODB_CONNECTION_TIMEOUT;

async function createConnection(connectionString:string, recreateDatabase:boolean) {
    try {
        logger.info('DB - Establishing connection to DB...');

        if (recreateDatabase) {
            logger.info('DB - Dropping curret DB...');
            dropDatabase(connectionString);
            logger.info('DB - DB cleared!');
        }

        await mongoose.connect(connectionString, {serverSelectionTimeoutMS: dbConnectionTimeout,});

        logger.info('DB - Connection established!')
    }

    catch(err) {
        logger.error('DB - Error connecting to the DB...', err);
        process.exit(1);
    }
}

async function dropDatabase(connectionString:string) {
    let connection = await mongoose.createConnection(connectionString, {connectTimeoutMS: dbConnectionTimeout}).asPromise();
    await connection.dropDatabase()
}

export default { createConnection, dropDatabase };