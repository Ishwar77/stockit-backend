(async () => {


    const logger = require('./app/utils/logger');
    logger.info("The StockIT app has started");
    const path = require('path');

    // 1. Create Express App instance
    const express = require("express");
    const app = new express();

    // STATIC PATHS
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

    // 2. Add the body Parser
    const bodyParser = require('body-parser');
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // File Uploading Support
    const fileUpload = require('express-fileupload');
    app.use(fileUpload({
        createParentPath: true,
        preserveExtension: 5,
        abortOnLimit: true,
        responseOnLimit: 'The file size is too large, try with files lesser than 1Mb',
        limitHandler: (req, res, next) => {
            logger.error('Prevented bulk file uploading');
            next();
        },
        tempFileDir: 'tmp',
        debug: false
    }));

    // 3. Inject the bootstrap Scripts
    const ScriptBundler = require('./app/utils/script-bundler');
    const bundlerObj = new ScriptBundler();
    try {
        await bundlerObj.bootstrapActionScripts(app);
    } catch (w) {
        console.log("Failed to Bootstrap");
        logger.error("Unable to Bootstrap the app");
        logger.error(w);
        process.exit(1);
    }

    // 5. Manage Routing, based on versions
    const mainRouter = require('./app/v1/route-controller-v1');
    app.use('/api/v1/', mainRouter);
})();