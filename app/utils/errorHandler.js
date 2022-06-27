const logger = require("./logger");
const process = require("process");
const Helper = require('./helper');
const config = require("config");
/**
 * To manage all uncaught errors and un handled promises
 */
module.exports = () => {
    process.on("uncaughtException", async (exc) => {
        await sendCrashReport(exc);
        logger.error("The Application terminates due to an UnCaughtException", exc);
        await Helper.databaseClose();
        setTimeout(() => {
            process.exit(1);
        }, 3000);
    });

    process.on("unhandledRejection", async (rej) => {
        await sendCrashReport(rej);
        logger.error("Caught an Unhandled Rejection Exception", rej);
        Helper.databaseClose();

        setTimeout(() => {
            process.exit(1);
        }, 3000);
    });


    function sendCrashReport(msg) {
        if(process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
            logger.info("App Crash notification is disabled, set NODE_ENV, to enable this feature");
            return;
        }

        const maintainers = config.get("maintainers");

        if (!maintainers) {
            logger.info('No Application Maintainers has been configured');
            return;
        }

        let appHost = null;

        try {
            appHost = config.get("app").host + ":" + config.get("app").port;
        } catch (e) {

        }

        const subject = "Crash Report: FitSocials, back-end project";
        const to = maintainers.join(', ');
        const text = `<pre>
            <h4>Host: ${appHost}</h4>
            ${msg}
        </pre>`

        Helper.sendEMail(to, subject, text, text).then(res => {
            logger.info('Application Crash Report has been sent to ' + to);
        }).catch(err => {
            logger.error(err);
            logger.info('Unable to send Application Crash Report to ' + to);
        });

    }


};

