const logger = require('../../utils/logger');
const ProductDAO = require('./product.dao');
const MyConst = require('../utils');
const { Transaction } = require('sequelize');
const Helper = require('../../utils/helper');
const Cryptic = require('../../utils/cryptic');

module.exports = class ProductModel {
    constructor(
        product_id, product_uuid, category_id, product_name, product_availability,
        product_brand_share, product_consumer_interest, product_reason_for_unavailability,
        product_osa_percentage, product_rcl, product_opportunity, product_image, barcode_number,
        created_at, updated_at, is_active = 1
    ) {
        this.product_id = product_id; this.product_uuid = product_uuid; this.category_id = category_id;
        this.product_name = product_name; this.product_availability = product_availability;
        this.product_brand_share = product_brand_share;
        this.product_consumer_interest = product_consumer_interest;
        this.product_reason_for_unavailability = product_reason_for_unavailability;
        this.product_osa_percentage = product_osa_percentage; this.product_rcl = product_rcl;
        this.product_opportunity = product_opportunity; this.product_image = product_image;
        barcode_number=barcode_number;
        this.created_at = created_at; this.updated_at = updated_at; this.is_active = is_active;
    }


    /**
* To insert into DB
* @param obj ProductModel 
*/
    static async createProduct(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + ProductModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        const data = " " + (JSON.stringify(obj.category_id)) + " " + (JSON.stringify(obj.product_name)) + " " + new Date();
        let prod_gen_uuid = Cryptic.hash(data);
        const productData = {
            product_uuid: prod_gen_uuid,
            category_id: obj.category_id,
            product_name: obj.product_name,
            product_availability: obj.product_availability,
            product_brand_share: obj.product_brand_share,
            product_consumer_interest: obj.product_consumer_interest,
            product_reason_for_unavailability: obj.product_reason_for_unavailability,
            product_osa_percentage: obj.product_osa_percentage,
            product_rcl: obj.product_rcl,
            product_opportunity: obj.product_opportunity,
            product_image: obj.product_image,
            barcode_number:obj.barcode_number
        }
        try {
            return await ProductDAO.create(productData);
        } catch (e) {
            logger.error('Unable to Create the Product');
            logger.error(e);
        }
        if (created) {
            return await ProductModel.getProductById(created['null'])
        }
        return created;
    }

    /**
* Utility function to get all Products
* @param from Number, recoard Offset, Get result from
* @param limit Number, max number of recoards
* @returns any[]
*/
    static async getProducts() {
        return await ProductDAO.findAll({
            where: {
                is_active: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    /**
    * Utility function to get by Products Id
    * @param product_id
    * @returns any
    */
    static async getProductById(productId = 0) {
        return await ProductDAO.findAll({
            where: {
                product_id: productId,
                is_active: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    /**
    * Utility function to get by Products Id
    * @param barcode_number
    * @returns any
    */
    static async getProductByBarcode(barcode = null){
        return await ProductDAO.findAll({
            where:{
                barcode_number:barcode,
                is_active: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        })
    }

    /**
* Utility function to update by Product Id
* @param product_id
* @params obj
* @returns any
*/
    static async updateProductById(productId = 0, obj = null) {
        let updated = null;
        // console.log('Updating, ', productId, obj);
        try {
            updated = await ProductDAO.update(obj, {
                where: {
                    product_id: productId,
                    is_active: true
                }
            });
        } catch (e) {
            // console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update the Product');
                logger.error(e);
            }
        }
        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return ProductModel.getProductById(productId);
        } else {
            return null;
        }
    }


    /**
* Utility function to delete by Products Id
* @param product_id
* @returns any
*/
    static async deleteProductById(productId = 0, fource = false) {
        if (!fource) {
            const del = await ProductModel.updateProductById(productId, { is_active: 0 });
            return del ? 1 : 0;
        }
        return await ProductModel.destroy({
            where: {
                product_id: productId
            }
        });
    }

    //Operations on UUID
    static async getProductByUUId(uuid = 0) {
        return await ProductDAO.findAll({
            where: {
                product_uuid: uuid,
                is_active: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }


    static async updateProductByUUId(uuid = 0, obj = null) {
        let updated = null;
        try {
            updated = await ProductDAO.update(obj, {
                where: {
                    product_uuid: uuid,
                    is_active: true
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update the Product');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return await ProductModel.getProductByUUId(uuid);
        } else {
            return null;
        }
    }

    static async deleteProductByUUId(uuid = 0, force = false) {
        if (!force) {
            const del = await ProductModel.updateProductByUUId(uuid, { is_active: 0 });
            return del ? 1 : 0;
        }
        return await ProductModel.destroy({
            where: {
                product_uuid: uuid
            }
        });
    }
}