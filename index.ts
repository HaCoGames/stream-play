/*************************
 * Main server file
 * Add and remove listeners and add controlled shutdown.
 */

import express, { type Application } from 'express';

import logger from './logger/logger.ts';

const PORT:number = Number(process.env.PORT) || 8080
const HOSTNAME:string = process.env.HOSTNAME || "127.0.0.1"
const BACKLOG:number = 0

const app: Application = express()

app.listen(PORT, HOSTNAME, BACKLOG, appStartHandler);


function appStartHandler(error?: Error) {
    if (error) {
        console.error(error)
        process.exit(1)
    }

    logger.info(`Server started on ${HOSTNAME}:${PORT}`)
}