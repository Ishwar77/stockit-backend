const logger = require('../../utils/logger');
const CategoryDAO = require('./category.dao');
const MyConst = require('../utils');
const { Transaction } = require('sequelize');
const Helper = require('../../utils/helper');
const Cryptic = require('../../utils/cryptic');

module.exports = class CategoryModel { 
    constructor(
        category_id, category_uuid, brand_id, category_name, brand_score, brand_osa, others,
        created_at, updated_at, is_active = 1
    ) {
        this.category_id = category_id; this.category_uuid = category_uuid; this.brand_id = brand_id;
        this.category_name = category_name; this.brand_score = brand_score;
        this.brand_osa = brand_osa; this.others = others;
        this.created_at = created_at; this.updated_at = updated_at; this.is_active = is_active;
    }

    
    /**
    * To insert into DB
    * @param obj CategoryModel 
    */
     static async createCategory(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + CategoryModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        const data = " " + (JSON.stringify(obj.brand_id)) + " " + (JSON.stringify(obj.category_name)) + " " + new Date();
        let category_gen_uuid = Cryptic.hash(data);
        const categoryData = {
            category_uuid: category_gen_uuid,
            brand_id: obj.brand_id,
            category_name: obj.category_name,
            brand_score: obj.brand_score,
            brand_osa: obj.brand_osa,
            others: obj.others
        }
        try {
            return await CategoryDAO.create(categoryData);
        } catch (e) {
            logger.error('Unable to Create the Category');
            logger.error(e);
        }
        if (created) {
            return await CategoryModel.getCategoryById(created['null'])
        }
        return created;
    }

    
    /**
* Utility function to get all Category
* @param from Number, recoard Offset, Get result from
* @param limit Number, max number of recoards
* @returns any[]
*/
static async getCategories() {
    return await CategoryDAO.findAll({
        where: {
            is_active: true
        },
        order: [
            ['created_at', 'DESC']
        ]
    });
}

    /**
    * Utility function to get by Category Id
    * @param category_id
    * @returns any
    */
     static async getCategoryById(categoryId = 0) {

        return await CategoryDAO.findAll({
            where: {
                category_id: categoryId,
                is_active: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }


    /**
    * Utility function to update by Category Id
    * @param category_id
    * @params obj
    * @returns any
    */
     static async updateCategoryById(categoryId = 0, obj = null) {
        let updated = null;
        // console.log('Updating, ', categoryId, obj);
        try {

            updated = await CategoryDAO.update(obj, {
                where: {
                    category_id: categoryId,
                    is_active: true
                }
            });
        } catch (e) {
            // console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update the Category');
                logger.error(e);
            }
        }
        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return CategoryModel.getCategoryById(categoryId);
        } else {
            return null;
        }
    }

        /**
     * Utility function to delete by Category Id
     * @param category_id
     * @returns any
     */
         static async deleteCategoryById(categoryId = 0, force = false) {
            if (!force) {
                const del = await CategoryModel.updateCategoryById(categoryId, { is_active: 0 });
                return del ? 1 : 0;
            }
            return await CategoryModel.destroy({
                where: {
                    category_id: categoryId
                }
            });
        }

        
    //Operations on UUID
    static async getCategoryByUUId(uuid = 0) {
        return await CategoryDAO.findAll({
            where: {
                category_uuid: uuid,
                is_active: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }


    static async updateCategoryByUUId(uuid = 0, obj = null) {
        let updated = null;
        try {
            updated = await CategoryDAO.update(obj, {
                where: {
                    category_uuid: uuid,
                    is_active: true
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update the Category');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return await CategoryModel.getCategoryByUUId(uuid);
        } else {
            return null;
        }
    }

    static async deleteCategoryByUUId(uuid = 0, force = false) {
        if (!force) {
            const del = await CategoryModel.updateCategoryByUUId(uuid, { is_active: 0 });
            return del ? 1 : 0;
        }
        return await CategoryModel.destroy({
            where: {
                category_uuid: uuid
            }
        });
    }
}