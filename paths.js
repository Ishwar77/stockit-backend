var path = require('path');
module.exports = {
    root: __dirname,
    logs: __dirname + path.sep + 'logs',
    app: __dirname + path.sep + 'apps',
    config: __dirname + path.sep + 'config',
    uploads: __dirname + path.sep + 'uploads',
    data: __dirname + path.sep + 'data',
    pathSeperator: path.sep
};