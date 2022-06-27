const logger = require('../../utils/logger');
const UsersDAO = require('./users.dao');
const MyConst = require('../utils');
const uuid = require('uuid-random');
const { Transaction } = require('sequelize');
const Helper = require('../../utils/helper');
const Cryptic = require('../../utils/cryptic');
const crypto = require('crypto');

module.exports = class UsersModel {
    constructor(
        user_id, user_uuid, user_role, user_name, mobile_number, email_id, password,
        created_at, updated_at, is_active = 1
    ) {
        this.user_id = user_id; this.user_uuid = user_uuid; this.user_role = user_role;
        this.user_name = user_name; this.mobile_number = mobile_number;
        this.email_id = email_id; this.password = password;
        this.created_at = created_at; this.updated_at = updated_at; this.is_active = is_active;
    }


    /**
    * To insert into DB
    * @param obj UsersModel 
    */
    static async createUsers(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + UsersModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        const data = " " + (JSON.stringify(obj.user_role)) + " " + (JSON.stringify(obj.user_name)) + " " + (JSON.stringify(obj.mobile_number)) + " " + (JSON.stringify(obj.email_id))  + " " + new Date();
        let user_gen_uuid = Cryptic.hash(data);
        const encrptPassword = crypto.createHash('sha256').update(obj.password).digest('hex');
        // console.log("encrptPassword ", encrptPassword);
        const usersData = {
            user_uuid: user_gen_uuid,
            user_role: obj.user_role,
            user_name: obj.user_name,
            mobile_number: obj.mobile_number,
            email_id: obj.email_id,
            password: encrptPassword
        }
        let userCount = 0;
        const rgisteredUsers = await UsersModel.getUsers();
        rgisteredUsers && rgisteredUsers.map(mapobj => {
            if (mapobj.user_name === obj.user_name || mapobj.email_id === obj.email_id || mapobj.mobile_number === obj.mobile_number) {
                userCount++;
            }
        });
        let created = null;
        if (!userCount) {
            try {
                return await UsersDAO.create(usersData);
            } catch (e) {
                logger.error('Unable to Create the User');
                logger.error(e);
            }
            if (created) {
                return await UsersModel.getUserById(created['null'])
            }
            return created;
        } else {
            created = 'User Already Registered, Please Login or use other credentials'
            return created;
        }
    }


    static async loginUsers(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + UsersModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        const encrptPassword = crypto.createHash('sha256').update(obj.password).digest('hex');
        const rgisteredUsers = await UsersModel.getUsers();
        let userCount = 0, userRole = null;
        rgisteredUsers && rgisteredUsers.map(mapobj => {
            if (mapobj.user_name === obj.user_name && mapobj.password === encrptPassword) {
                userRole = obj.userRole;
                userCount++;
            }
        });
        return userCount;
    }


    /**
    * Utility function to get all Users
    * @param from Number, recoard Offset, Get result from
    * @param limit Number, max number of recoards
    * @returns any[]
    */
    static async getUsers(/**from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT*/) {

        return await UsersDAO.findAll({
            where: {
                is_active: true
            },
            order: [
                ['created_at', 'DESC']
            ],
            // offset: from,
            // limit: limit
        });
    }


    /**
    * Utility function to get by Users Id
    * @param user_id
    * @returns any
    */
    static async getUserById(userId = 0) {

        return await UsersDAO.findAll({
            where: {
                user_id: userId,
                is_active: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }


    /**
    * Utility function to update by Users Id
    * @param user_id
    * @params obj
    * @returns any
    */
    static async updateUsersById(userId = 0, obj = null) {
        let updated = null;
        // console.log('Updating, ', userId, obj);
        try {

            updated = await UsersDAO.update(obj, {
                where: {
                    user_id: userId,
                    is_active: true
                }
            });
        } catch (e) {
            // console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update the User');
                logger.error(e);
            }
        }
        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return UsersModel.getUserById(userId);
        } else {
            return null;
        }
    }


    /**
     * Utility function to delete by Users Id
     * @param user_id
     * @returns any
     */
    static async deleteUserById(userId = 0, force = false) {
        if (!force) {
            const del = await UsersModel.updateUsersById(userId, { is_active: 0 });
            return del ? 1 : 0;
        }
        return await UserModel.destroy({
            where: {
                user_id: userId
            }
        });
    }


    //Operations on UUID
    static async getUsersByUUId(uuid = 0) {
        return await UsersDAO.findAll({
            where: {
                user_uuid: uuid,
                is_active: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }


    static async updateUsersByUUId(uuid = 0, obj = null) {
        let updated = null;
        try {
            updated = await UsersDAO.update(obj, {
                where: {
                    user_uuid: uuid,
                    is_active: true
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update the User');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return await UsersModel.getUsersByUUId(uuid);
        } else {
            return null;
        }
    }


    static async deleteUserByUUId(uuid = 0, force = false) {
        if (!force) {
            const del = await UsersModel.updateUsersByUUId(uuid, { is_active: 0 });
            return del ? 1 : 0;
        }
        return await UsersModel.destroy({
            where: {
                user_uuid: uuid
            }
        });
    }
}