import { createLogger, format, transports, Logger } from "winston";
import DEFAULTS from "../config/DEFAULTS.ts";

const winstonLoggerOptions = {
    level: process.env.LOG_LEVEL || DEFAULTS.LOG_LEVEL,
    format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.errors({stack:true}),
        format.splat(),
        format.json(),
    ),
    defaultMeta: {service: 'user-service'},
    transports: [
        new transports.File({ filename: `logs/${getCurrentTimeAndDate()}_error.log`, level: 'error' }),
        new transports.File({ filename: `logs/${getCurrentTimeAndDate()}_combined.log` }),
    ],
}
const logger: Logger = createLogger(winstonLoggerOptions);

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        ),
    }));
}

export default logger;

function getCurrentTimeAndDate() {
    const date:Date = new Date();

    return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}/`;
}