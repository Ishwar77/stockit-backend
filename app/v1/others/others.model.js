const logger = require('../../utils/logger');
const Helper = require('../../utils/helper');

class OtherModels {
    static async getCategorySpecificJoinDetails() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`SELECT store.store_name, store.store_address, brand.brand_name, category.category_name, category.brand_osa, category.brand_score
            FROM store
            INNER JOIN brand ON store.store_id = brand.store_id
            INNER JOIN category ON brand.brand_id = category.brand_id
            WHERE store.is_active = 1 AND brand.is_active = 1 AND category.is_active = 1`);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the info");
            logger.error(e);
            result = [];
        }
        return result;
    }

    static async getOpportunityDetails() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`SELECT store.store_name, store.store_address, brand.brand_name, category.category_name, products.*
            FROM store
            INNER JOIN brand ON store.store_id = brand.store_id
            INNER JOIN category ON brand.brand_id = category.brand_id
            INNER JOIN products ON category.category_id = products.category_id
            WHERE store.is_active = 1 AND brand.is_active = 1 AND category.is_active = 1`);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the info");
            logger.error(e);
            result = [];
        }
        return result;
    }
}

module.exports = OtherModels;