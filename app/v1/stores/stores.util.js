const MyConst = require('../utils');
const JOI = require('@hapi/joi');

module.exports = class StoresUtil {

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

        const error = StoresUtil.getJoiVerificationModel(action, model).validate(model);
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
            store_uuid: JOI.string(),
            user_id: JOI.number(),
            store_name: JOI.string(),
            store_address: JOI.string(),
            store_shares: JOI.string(),
            store_sales_progress: JOI.string(),
            store_availability: JOI.string(),
            created_at: JOI.date().default(new Date()),
            updated_at: JOI.date().default(new Date()),
            is_active: JOI.number().default(1),
        });
    } else {
        return JOI.object(StoresUtil.generateDynamicUpdateValidator(reqBody));
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
            case "store_uuid":
                validator[`${prop}`] = JOI.string(); break;
            case "user_id":
                validator[`${prop}`] = JOI.number(); break;
            case "store_name":
                validator[`${prop}`] = JOI.string(); break;
            case "store_address":
                validator[`${prop}`] = JOI.string(); break;
            case "store_shares":
                validator[`${prop}`] = JOI.string(); break;
            case "store_sales_progress":
                validator[`${prop}`] = JOI.string(); break;
            case "store_availability":
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