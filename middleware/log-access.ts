import type { NextFunction, Request, Response } from "express";
import logger from "../logger/logger.ts";

const LOGGER_TAG = "log-access.ts"

function entrance(req: Request, res: Response, next: NextFunction) {
    const timestampStart = Date.now();
    res.addListener('close', () => {
        const timestampEnd = Date.now();
    
        logger.debug(`${LOGGER_TAG} - REQUEST ${req.hostname} ${req.method} ${req.path} - ${timestampEnd-timestampStart}ms`);
    })

    next();
}

export default {
    entrance
}