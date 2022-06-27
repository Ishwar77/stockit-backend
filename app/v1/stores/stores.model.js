const logger = require('../../utils/logger');
const StoresDAO = require('./stores.dao');
const MyConst = require('../utils');
const { Transaction } = require('sequelize');
const Helper = require('../../utils/helper');
const Cryptic = require('../../utils/cryptic');

module.exports = class StoresModel {
    constructor(
        store_id, store_uuid, user_id, store_name, store_address, store_shares, store_sales_progress,
        store_availability, created_at, updated_at, is_active = 1
    ) {
        this.store_id = store_id; this.store_uuid = store_uuid; this.user_id = user_id;
        this.store_name = store_name; this.store_address = store_address; this.store_shares = store_shares;
        this.store_sales_progress = store_sales_progress; this.store_availability = store_availability;
        this.created_at = created_at; this.updated_at = updated_at; this.is_active = is_active;
    }


    /**
    * To insert into DB
    * @param obj StoresModel 
    */
    static async createStores(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + StoresModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        const data = " " + (JSON.stringify(obj.user_id)) + " " + (JSON.stringify(obj.store_name)) + " " + (JSON.stringify(obj.store_address)) + " " + new Date();
        let store_gen_uuid = Cryptic.hash(data);
        const storesData = {
            store_uuid: store_gen_uuid,
            user_id: obj.user_id,
            store_name: obj.store_name,
            store_address: obj.store_address,
            store_shares: obj.store_shares,
            store_sales_progress: obj.store_sales_progress,
            store_availability: obj.store_availability
        }
        try {
            return await StoresDAO.create(storesData);
        } catch (e) {
            logger.error('Unable to Create the Store');
            logger.error(e);
        }
        if (created) {
            return await StoresModel.getStoreById(created['null'])
        }
        return created;
    }

    /**
* Utility function to get all Stores
* @param from Number, recoard Offset, Get result from
* @param limit Number, max number of recoards
* @returns any[]
*/
    static async getStores() {
        return await StoresDAO.findAll({
            where: {
                is_active: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }


    /**
    * Utility function to get by Stores Id
    * @param store_id
    * @returns any
    */
    static async getStoreById(storeId = 0) {

        return await StoresDAO.findAll({
            where: {
                store_id: storeId,
                is_active: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }



    /**
    * Utility function to update by Stores Id
    * @param store_id
    * @params obj
    * @returns any
    */
    static async updateStoresById(storeId = 0, obj = null) {
        let updated = null;
        // console.log('Updating, ', storeId, obj);
        try {

            updated = await StoresDAO.update(obj, {
                where: {
                    store_id: storeId,
                    is_active: true
                }
            });
        } catch (e) {
            // console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update the Store');
                logger.error(e);
            }
        }
        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return StoresModel.getStoreById(storeId);
        } else {
            return null;
        }
    }



    /**
     * Utility function to delete by Stores Id
     * @param store_id
     * @returns any
     */
    static async deleteStoreById(storeId = 0, force = false) {
        if (!force) {
            const del = await StoresModel.updateStoresById(storeId, { is_active: 0 });
            return del ? 1 : 0;
        }
        return await StoresModel.destroy({
            where: {
                store_id: storeId
            }
        });
    }


    //Operations on UUID
    static async getStoresByUUId(uuid = 0) {
        return await StoresDAO.findAll({
            where: {
                store_uuid: uuid,
                is_active: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }


    static async updateStoresByUUId(uuid = 0, obj = null) {
        let updated = null;
        try {
            updated = await StoresDAO.update(obj, {
                where: {
                    store_uuid: uuid,
                    is_active: true
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update the Store');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return await StoresModel.getStoresByUUId(uuid);
        } else {
            return null;
        }
    }


    static async deleteStoreByUUId(uuid = 0, force = false) {
        if (!force) {
            const del = await StoresModel.updateStoresByUUId(uuid, { is_active: 0 });
            return del ? 1 : 0;
        }
        return await StoresModel.destroy({
            where: {
                store_uuid: uuid
            }
        });
    }
}