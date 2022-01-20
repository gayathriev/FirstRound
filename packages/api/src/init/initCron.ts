import cron from 'node-cron';

// helper imports
import { cronHelper } from "../shared-resources/utils/cron-worker";

/**
 * @description
 * Initialise a worker cron to clean up
 * expired specials, promotions and old
 * notifications from the database
 */
export const initCron = async () => {

    console.log("[>>] Starting cron worker 🧹")
    cronHelper();

    cron.schedule('0 4 * * *', () => {
        // call the workCron function
        cronHelper();
    });

}