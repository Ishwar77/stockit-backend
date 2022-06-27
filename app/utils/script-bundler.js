const logger = require('./logger');
const Helper = require("./helper");


module.exports = class ScriptBundler {

    constructor() {
    }

    async bootstrapActionScripts(expressAppInstance) {

        if (!expressAppInstance || expressAppInstance === null) {
            logger.warn("Expecing expecting the Express Application instance, found null ");
            return;
        }
        // 1. Add generic error Handler
        require("./errorHandler")();

        // 2. Enable COROS, Compression... for a Prod ready build
        require("./prodReady").make(expressAppInstance);
        // 3. Connect to DB
        await Helper.databaseOpen();

        logger.info("Starting Server");
        // 5. Run App Server
        const port = Helper.getAppConfig("port") || 8888;
        // const appHost = Helper.getAppConfig("host");

        expressAppInstance.listen(port, () => {
            logger.info(`The StockIT Service at Port :${port} `);
        });

        return true;
    }
};
