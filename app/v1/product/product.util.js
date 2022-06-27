const MyConst = require('../utils');
const JOI = require('@hapi/joi');

module.exports = class ProductUtil {
    /**
     * Utility method to validate the Object
     * @param action  MyConst.ValidationModelFor
     * @returns null | Object
     */
    static hasError(model, action = MyConst.ValidationModelFor.CREATE) {
        if (!model) {
            return { error: "Data Missing" };
        }

        const keys = Object.getOwnPropertyNames(model);
        // console.log('Keys = ', keys);
        if (!keys || !keys.length) {
            return { error: "Data Missing" };
        }

        const error = ProductUtil.getJoiVerificationModel(action, model).validate(model);
        // console.log('Uril< has err =', error);
        return (error && error.error) ? error.error : null;
    }


    /**
* Utility functio to get the Validation Schema
* @param action MyConst.ValidationModelFor DEFAULT = MyConst.ValidationModelFor.CREATE
* @returns JOI Schema
*/
    static getJoiVerificationModel(action = MyConst.ValidationModelFor.CREATE, reqBody = null) {
        if (action === MyConst.ValidationModelFor.CREATE) {
            return JOI.object({
                product_uuid: JOI.string(),
                category_id: JOI.number(),
                product_name: JOI.string(),
                product_availability: JOI.string(),
                product_brand_share: JOI.string(),
                product_consumer_interest: JOI.string(),
                product_reason_for_unavailability: JOI.string(),
                product_osa_percentage: JOI.string(),
                product_rcl: JOI.string(),
                product_opportunity: JOI.string(),
                product_image: JOI.string(),
                barcode_number:JOI.string(),
                created_at: JOI.date().default(new Date()),
                updated_at: JOI.date().default(new Date()),
                is_active: JOI.number().default(1),
            });
        } else {
            return JOI.object(ProductUtil.generateDynamicUpdateValidator(reqBody));
        }
    }


    static generateDynamicUpdateValidator(reqBody) {
        if (!reqBody) {
            return null;
        }
        const validator = {};
        const props = Object.getOwnPropertyNames(reqBody);
        props.forEach(prop => {
            switch (prop) {
                case "product_uuid":
                    validator[`${prop}`] = JOI.string(); break;
                case "category_id":
                    validator[`${prop}`] = JOI.number(); break;
                case "product_name":
                    validator[`${prop}`] = JOI.string(); break;
                case "product_availability":
                    validator[`${prop}`] = JOI.string(); break;
                case "product_brand_share":
                    validator[`${prop}`] = JOI.string(); break;
                case "product_consumer_interest":
                    validator[`${prop}`] = JOI.string(); break;
                case "product_reason_for_unavailability":
                    validator[`${prop}`] = JOI.string(); break;
                case "product_osa_percentage":
                    validator[`${prop}`] = JOI.string(); break;
                case "product_rcl":
                    validator[`${prop}`] = JOI.string(); break;
                case "product_opportunity":
                    validator[`${prop}`] = JOI.string(); break;
                case "product_image":
                    validator[`${prop}`] = JOI.string(); break;
                case "barcode_number":
                    validator[`${prop}`] = JOI.string(); break;
                case "is_active":
                    validator[`${prop}`] = JOI.number(); break;
                case "created_at":
                    validator[`${prop}`] = JOI.date(); break;
                case "updated_at":
                    validator[`${prop}`] = JOI.date(); break;
            }
        });
        // console.log('validator = ', validator);
        return validator;
    }
}