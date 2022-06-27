const logger = require('../../utils/logger');
const BrandDAO = require('./brand.dao');
const MyConst = require('../utils');
const { Transaction } = require('sequelize');
const Helper = require('../../utils/helper');
const Cryptic = require('../../utils/cryptic');

module.exports = class BrandModel {
    constructor(
        brand_id, brand_uuid, store_id, brand_name, created_at, updated_at, is_active = 1
    ) {
        this.brand_id = brand_id; this.brand_uuid = brand_uuid; 
        this.store_id = store_id; this.brand_name = brand_name;
        this.created_at = created_at; this.updated_at = updated_at; this.is_active = is_active;
    }
    

    /**
    * To insert into DB
    * @param obj BrandModel 
    */
     static async createBrands(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + BrandModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        const data = " " + (JSON.stringify(obj.store_id)) + " " + (JSON.stringify(obj.brand_name)) + " " + new Date();
        let brand_gen_uuid = Cryptic.hash(data);
        const brandsData = {
            brand_uuid: brand_gen_uuid,
            store_id: obj.store_id,
            brand_name: obj.brand_name
        }
        try {
            return await BrandDAO.create(brandsData);
        } catch (e) {
            logger.error('Unable to Create the Brand');
            logger.error(e);
        }
        if (created) {
            return await BrandModel.getBrandById(created['null'])
        }
        return created;
    }

        /**
* Utility function to get all Brands
* @param from Number, recoard Offset, Get result from
* @param limit Number, max number of recoards
* @returns any[]
*/
static async getBrands() {
    return await BrandDAO.findAll({
        where: {
            is_active: true
        },
        order: [
            ['created_at', 'DESC']
        ]
    });
}

    /**
    * Utility function to get by Brands Id
    * @param brand_id
    * @returns any
    */
     static async getBrandById(brandId = 0) {
        return await BrandDAO.findAll({
            where: {
                brand_id: brandId,
                is_active: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

        /**
    * Utility function to update by Brands Id
    * @param brand_id
    * @params obj
    * @returns any
    */
         static async updateBrandsById(brandId = 0, obj = null) {
            let updated = null;
            // console.log('Updating, ', brandId, obj);
            try {
                updated = await BrandDAO.update(obj, {
                    where: {
                        brand_id: brandId,
                        is_active: true
                    }
                });
            } catch (e) {
                // console.log('Catch Update = ', e);
                if (!e) {
                    updated = [1];
                } else {
                    logger.error('Unable to Update the Brand');
                    logger.error(e);
                }
            }
            // console.log('updated = ', updated);
            if (updated && updated.length && updated[0] === 1) {
                return BrandModel.getBrandById(brandId);
            } else {
                return null;
            }
        }

        
    /**
     * Utility function to delete by Brands Id
     * @param brand_id
     * @returns any
     */
    static async deleteBrandById(brandId = 0, fource = false) {
        if (!fource) {
            const del = await BrandModel.updateBrandsById(brandId, { is_active: 0 });
            return del ? 1 : 0;
        }
        return await BrandModel.destroy({
            where: {
                brand_id: brandId
            }
        });
    }


        //Operations on UUID
        static async getBrandsByUUId(uuid = 0) {
            return await BrandDAO.findAll({
                where: {
                    brand_uuid: uuid,
                    is_active: true
                },
                order: [
                    ['created_at', 'DESC']
                ]
            });
        }
        

    static async updateBrandsByUUId(uuid = 0, obj = null) {
        let updated = null;
        try {
            updated = await BrandDAO.update(obj, {
                where: {
                    brand_uuid: uuid,
                    is_active: true
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update the Brand');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return await BrandModel.getBrandsByUUId(uuid);
        } else {
            return null;
        }
    }

    static async deleteBrandsByUUId(uuid = 0, force = false) {
        if (!force) {
            const del = await BrandModel.updateBrandsByUUId(uuid, { is_active: 0 });
            return del ? 1 : 0;
        }
        return await BrandModel.destroy({
            where: {
                brand_uuid: uuid
            }
        });
    }
}