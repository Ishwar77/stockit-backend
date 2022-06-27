const config = require('config');
const logger = require('./logger');
const jwt = require("jsonwebtoken");
const Cryptic = require("./cryptic");
const nodemailer = require("nodemailer");
const Auth = require("../models/auth");
const { Sequelize } = require('sequelize');
const MomentTz = require('moment-timezone');
const moment = require("moment");

var smtpTransport = require('nodemailer-smtp-transport');



const gmailSender = require('gmail-send');

module.exports = class Helper {
    /** To Hold the Databse connection string */
    static dbInstance = null;

    static Moment = null;

    /**
     * Verifies if dbInstance is defined, if not a DB connection is established and set here
     * @param {*} dbType 
     */
    static async databaseOpen(dbType = "mysql") {

        if (Helper.dbInstance) {
            return;
        }

        let dbConf = null;

        try {
            dbConf = config.get('db');
        } catch (e) {
            logger.error(e);
            return null;
        }

        if (!dbConf || !dbConf.length) throw new Error('No Database configuration exists...!');
        const match = dbConf.filter(db => db.type.toLowerCase() === dbType.toLowerCase());
        if (!match || !match.length) {
            logger.error("Set the Database configurations in the Environment first");
            Helper.dbInstance = null;
            return;
        }

        const dbConfig = match[0];
        // logger.info('Match = '+ dbConfig);
        // logger.info('un = '+ config.get(dbConfig.username) );
        const un = config.get(dbConfig.username) || 'maiora';
        const ps = config.get(dbConfig.password) || 'Madmin@6977';
        const database = config.get(dbConfig.database) || 'Madmin@6977';

        logger.info(`Connecting to DB '${database}' at host = ${dbConfig.host}`);

        // Option 2: Passing parameters separately (other dialects)
        const sequelize = new Sequelize(database, un, ps, {
            host: dbConfig.host,
            logging: false,
            dialect: dbType,
            port: '3306',
            define: {
                paranoid: true
            },
            pool: {
                max: 5,
                min: 0,
                idle: 30000,
                acquire: 10000,
                evict: 10000,
                handleDisconnects: true
            }
        });

        try {
            await sequelize.authenticate();
            Helper.dbInstance = sequelize;
            logger.info("Connected to DB at " + match[0].host);
        } catch (e) {
            logger.error("Failed connecting to DB at " + match[0].host);
            logger.error(e);
            Helper.dbInstance = null;
        }
    }


    static getMomentInstance(timeZone = 'Asia/Calcutta') {
        const tz = timeZone ? timeZone : config.get('TZ') || 'Asia/Calcutta';
        if (!Helper.Moment) {
            Helper.Moment = MomentTz.tz.setDefault(tz);
        }
        return Helper.Moment;
    }

    static async databaseClose(dbType = "mysql") {

        //  console.log('Helper.dbInstance = ', Helper.dbInstance);
        if (!Helper.dbInstance) {
            return;
        }
        let res = null;
        try {
            res = await Helper.dbInstance.close();
            logger.error("DB connection has closed ");
            Helper.dbInstance = null;
        } catch (e) {
            logger.error("Failed connecting to DB at " + match[0].host);
            logger.error(e);
            Helper.dbInstance = null;
        }
    }


    /** 
     * To get configured application port 
     * @returns number 
     */
    static getAppConfig(conf = null) {
        const appConf = config.get("app");

        //  console.log('App Conf = ', appConf.host);

        if (!appConf) return null;
        if (!conf) return appConf;

        conf = conf.trim();

        if (conf === 'port') {
            if (process.env && process.env.PORT) {
                return process.env.PORT;
            }
            return appConf.port || null;
        } else {
            return appConf[conf];
        }
    }

    /**
     * To fetch secret key, stored in environment variable
     * @returns String | null
     * @see "../../scripts/dev.bat"
     */
    static getSecretKey() {
        if (!Helper.secretKey) {
            Helper.secretKey = config.get("secretkey");
        }
        return Helper.secretKey;
    }

    /**
     * To generate JWT token on a given payload
     * @param payload Object, data to be sent throught JWT 
     * @param secretKey String, OPTIONAL Secret String used to encrypt the data, obtained rom environment variable
     * @param expiry String, OPTIONAL How long the tokin s valid e.g. '2' for 2 seconds, '3h' for 3 hours, DEFAULT '1d' i.e. 1 day
     * @returns String
     */
    static async generateJWT(payload, secretKey = null, expiry = "1d", blankSign = false) {
        secretKey = secretKey ? secretKey : Helper.getSecretKey();

        const conf = blankSign ? null : { expiresIn: expiry };

        return await jwt.sign(payload, secretKey, conf);
    }

    /**
     * To verify the correctness of the JWT Signature
     * @param token String, the JWT Signature 
     * @param secretKey String, the secrate key
     * @returns string | object
     */
    static async verifyJWT(token, secretKey = null) {
        secretKey = secretKey ? secretKey : Helper.getSecretKey();
        return await jwt.verify(token, secretKey);
    }


    /**
     * Utility method to create an Authorized token, with default expiry of 30 day
     * @param data Object{payload: any, locked: boolean} 
     * @param key String
     * @returns String
     * @see https://gitlab.com/memo-feeds/documentation/blob/master/backend/Auth.md#authorization
     */
    static async createAuthToken(data, key, expiry = '30 days') {

        if (!data || !key) return null;

        const transformedData = Cryptic.transformData(data.payload, 'ENC');
        //  console.log('transformedData = ', transformedData);
        const hash = Cryptic.hash(transformedData, key);

        // if (!transformedData) return null;

        const authInfo = {
            payload: hash,
            locked: data.locked || false
        };

        let tok = null;
        try {
            tok = await Helper.generateJWT(authInfo, key, expiry);
        } catch (e) {
            logger.error(`Failed to create Auth token `);
            logger.error(e);
        }
        return tok;
    }

    /**
     * Utility method to Verify given Authorized token, with default expiry of 1 day
     * @param data String, JWT web token create by  Helper.createAuthToken()
     * @param key String, Pass phrase 
     * @returns boolean | null
     * @see https://gitlab.com/memo-feeds/documentation/blob/master/backend/Auth.md#authorization
     */
    static async verifyAuthToken(token, key) {
        if (!token || !key) return null;

        let tokenData = null;
        try {
            tokenData = await Helper.verifyJWT(token, key);
            return (tokenData && tokenData.payload) ? true : false;
            // TODO : This is not a proper token validation...!
        } catch (e) {
            logger.error(`Failed to verify Auth token "${token}"`);
            logger.error(e);
        }
        return null;
    }

    static getAuthTokenFromHeader(httpRequest) {
        if (!httpRequest || !httpRequest.headers) throw new Error("Missing HttpRequest");

        const tokenName = Helper.getAppConfig()['tokenNameInRequests'] || 'authtoken';
        const token = Auth.getTokenFromReqObj(httpRequest.headers, tokenName);
        return token;
    }

    static getSenderEmailAddress() {
        try {
            return config.get(config.get('mail').emailAddress)
        } catch (e) {
            return "yesho@maiora.co";
        }
    }

    static getMaintainer(top = true) {
        let maintainers = [];
        try {
            maintainers = config.get("maintainers");
        } catch (e) {
            maintainers['sriharsha.cr@maiora.co'];
        }
        return top ? [maintainers[0]] : maintainers;
    }

    /**
     * To send Email using nodemailer, based on configured emailProvider in the project environment
     * SUPPORTED Providers = "sendgrid", "gmail", "outlook"
     * @param to String or comma seperated strings
     * @param subject String
     * @param text String, plain text email
     * @param html String, Html format of email
     * @param from String, OPTIONAL Sender address DEFAULT =  "Maiora <sriharsha.cr@maiora.com>", mail config obtained from /config/*.json
     * @param attachements Object[{ filename: string, content: Buffer }], OPTIONAL attachements list
     * @param critical Boolean, Decides weather to have Admin as CC/BCC and also to have Maintiner in BCC for Critical
     * @param bbcs {bcc: [], isMassMailer: boolean}
     * @see https://nodemailer.com/about/
     * @see https://nodemailer.com/smtp/oauth2/
     * @see https://medium.com/@RistaSB/use-expressjs-to-send-mails-with-gmail-oauth-2-0-and-nodemailer-d585bba71343
     * @see https://stackoverflow.com/questions/45494639/nodemailer-error-self-signed-certificate-in-certificate-chain
     */
    static async sendEMail(to, subject, text, html, from, attachements = null, critical = false, overrideAll = false, bccd = null) {
        if(!overrideAll) {
            from = `The Fit Socials<${config.get(config.get('mail').emailAddress)}>`;
        }

        if(!to && bccd) {
            to = config.get('mail').sender || null;
            console.log('To = ', to);
        }
        // console.log('Senders Email = ', from);
        // console.log('To = ', to);

        const mailConfig = {};
        mailConfig['emailAddress'] = config.get(config.get('mail').emailAddress);
        mailConfig['emailPassword'] = config.get(config.get('mail').emailPassword);
        mailConfig['emailProvider'] = config.get(config.get('mail').emailProvider);

        if (!from || mailConfig['emailProvider'] === 'outlook') {
            if(!overrideAll && !from) {
                from = config.get('mail').sender || null;
            }
            //    console.log('From = ', from);
        }

        if (mailConfig['emailProvider'] === 'gmail') {
            const o = {
                user: mailConfig['emailAddress'],
                pass: mailConfig['emailPassword'],
                to: to,
                subject: subject,
                text: text, // plain text body
                html: html
            };

            if(critical) {
                if(from !== to) {
                    o['cc'] = Helper.getSenderEmailAddress();
                }
                o['bcc'] = Helper.getMaintainer(true).join(', ');
            } else {
                if(from !== to) {
                    o['bcc'] = Helper.getSenderEmailAddress();
                }
            }
            if(bccd && bccd['bcc'] && bccd['isMassMailer']) {
                o['to'] = null;
                o['bcc'] = bccd['bcc'];
            }
            // console.log('Main = ', Helper.getMaintainer(true));
            // console.log('Options = ', o);
            const options = gmailSender(o);

            options({}, (err, res, full) => {
                if (err) {
                    console.log(err);
                    logger.error(`Failed to send email to ${to} `);
                    logger.error(err);
                    return null;
                }
                logger.info(`Email Sent to ${to} `);
                logger.info(res);
                logger.info(full);
                return res;
            });
            return;
        }

        const transporter = Helper.getMailerTransport();
        // console.log('Email Transporter = ', transporter)

        if (!transporter) {
            console.log('No Transporter found, cannot send email');
            return;
        }
        // logger.info('Email Transporter = ', transporter)
        try {
            const opt = {
                from: from,
                to: to, // list of receivers comma seperated
                subject: subject, // Subject line
                text: text, // plain text body
                html: html // html body
            };
            if(critical) {
                if(from !== to) {
                    opt['cc'] = Helper.getSenderEmailAddress();
                }
                opt['bcc'] = Helper.getMaintainer(true).join(', ');
            } else {
                if(from !== to) {
                    opt['bcc'] = Helper.getSenderEmailAddress();
                }
            }

            if(bccd && bccd['bcc'] && bccd['isMassMailer']) {
                opt['to'] = null;
                opt['bcc'] = bccd['bcc'];
            }
          //  console.log('Main = ', Helper.getMaintainer(true));
          //  console.log('Options = ', opt);
            const info = await transporter.sendMail(opt);
            return info;
        } catch (e) {
            logger.error(`Failed to send email to ${to} `);
            logger.error(e);
            return null;

        } finally {
            transporter.close();
        }

    }

    static getMailerTransport() {
        const mailConf = config.get('mail');

        if (!mailConf) {
            console.log('Email Configuration not fount in the Environment');
            return null;
        }
        const mailConfig = {};
       // console.log('Sender Email = ', config.get(config.get('mail').emailAddress));
        mailConfig['emailAddress'] = config.get(config.get('mail').emailAddress);
        mailConfig['emailPassword'] = config.get(config.get('mail').emailPassword);
        mailConfig['emailProvider'] = config.get(config.get('mail').emailProvider);

        //   console.log('mailConfig = ', mailConfig);


        if (mailConfig.emailProvider === 'sendgrid') {
            return nodemailer.createTransport(smtpTransport, {
                service: 'SendGrid',
                secure: false,
                auth: {
                    user: 'apikey', // generated ethereal user
                    pass: config.get('mailerApiKey') // generated ethereal password
                }
            });
        } else if (mailConfig.emailProvider === 'outlook') {
            return nodemailer.createTransport({
                host: "smtp.office365.com", // hostname
                secureConnection: false, // TLS requires secureConnection to be false
                port: 587, // port for secure SMTP
                tls: {
                    ciphers: 'SSLv3'
                },
                auth: {
                    user: mailConfig.emailAddress,
                    pass: mailConfig.emailPassword
                }
            });
        }
    }


    static getGoogleOathInstance() {
        let clientId = null;
        let clientSecret = null;
        let refreshToken = null;

        try {
            clientId = config.get(config.get('mail').gmailClientId);
            clientSecret = config.get(config.get('mail').gmailClientSecret);
            refreshToken = config.get(config.get('mail').gmailRefreshToken);
        } catch (e) {
            logger.error("Google Keys are not configured in the Environment");
            logger.error(`define "${config.get('mail').gmailClientId}" and "${config.get('mail').gmailClientSecret}" `);
            logger.error(e);
        }

        if (!clientId || !clientSecret || !refreshToken) {
            logger.error("Google Keys are not configured in the Environment");
            logger.error(`define "${config.get('mail').gmailClientId}" and "${config.get('mail').gmailClientSecret}" `);
            return;
        }

        return {
            id: clientId,
            secret: clientSecret,
            refreshToken: refreshToken
        };
    }

};
