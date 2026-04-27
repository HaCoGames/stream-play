/*************************
 * Main server file
 * Add and remove listeners and add controlled shutdown.
 */

/***************APPLICATION*********************** */
import express, { type Application } from 'express';
import path from 'node:path';

/***************LOGGING*********************** */
import logger from './logger/logger.ts';
import logAccess from './middleware/log-access.ts';

/***************CONFIGURATION*********************** */
import DEFAULTS from './config/DEFAULTS.ts';

/***************DATABASE*********************** */
import db from './db/database.ts'

//Constants that come from the process env
const PORT:number = Number(process.env.PORT) || DEFAULTS.PORT;
const HOSTNAME:string = process.env.HOSTNAME || DEFAULTS.HOSTNAME;
const BACKLOG:number = 0;

//General constants
const __dirname: string = path.dirname('index.ts');
const APP_STATIC_DIR = path.join(__dirname, 'public', 'dist');
const LOGGING_TAG = 'index.ts';

//DATABASE (MONGO)
const MONGODB_CONNECTION_STRING:string =  process.env.MONGODB_CONNECTION_STRING || DEFAULTS.MONGODB_CONNECTION_STRING;
const MONGODB_RECREATE:boolean = process.env.MONGODB_RECREATE === 'true';

const app: Application = express();

//App middleware
app.use(logAccess.entrance);
app.use(express.json())
app.use(express.static(APP_STATIC_DIR));

logger.info(LOGGING_TAG + ` - Using log level ${DEFAULTS.LOG_LEVEL}, APP_STATIC_DIR: ${APP_STATIC_DIR}`);

//App handlers
app.get('/pi', async (req,res) => {
    const iterations: number = req.body.iterations || req.query.iterations || 100;

    function calculate_pi(iterations: number) {
        let pi = 0;
        let sign = 1;
        let denominator, term;
        for (let i = 0; i < iterations; i++) {
            denominator = 2 * i + 1;
            term = sign / denominator;
            pi += term;
            sign *= -1;

            logger.debug(`PI is ${pi}`)
        }
        return pi;
    }

    res.json({pi: calculate_pi(iterations)})
});

logger.info('index.ts - Starting up backend...');

await db.createConnection(MONGODB_CONNECTION_STRING, MONGODB_RECREATE);

//App starting point
app.listen(PORT, HOSTNAME, BACKLOG, appStartHandler);


function appStartHandler(error?: Error) {
    if (error) {
        console.error(error)
        process.exit(1)
    }

    logger.info(LOGGING_TAG + ` - Server started on ${HOSTNAME}:${PORT}`)
}