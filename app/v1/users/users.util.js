const MyConst = require('../utils');
const JOI = require('@hapi/joi');

module.exports = class UsersUtil {

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

        const error = UsersUtil.getJoiVerificationModel(action, model).validate(model);
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
                user_uuid: JOI.string(),
                user_role: JOI.string(),
                user_name: JOI.string(),
                mobile_number: JOI.string(),
                email_id: JOI.string(),
                password: JOI.string(),
                created_at: JOI.date().default(new Date()),
                updated_at: JOI.date().default(new Date()),
                is_active: JOI.number().default(1),
            });
        } else {
            return JOI.object(UsersUtil.generateDynamicUpdateValidator(reqBody));
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
                case "user_uuid":
                    validator[`${prop}`] = JOI.string(); break;
                case "user_role":
                    validator[`${prop}`] = JOI.string(); break;
                case "user_name":
                    validator[`${prop}`] = JOI.string(); break;
                case "mobile_number":
                    validator[`${prop}`] = JOI.string(); break;
                case "email_id":
                    validator[`${prop}`] = JOI.string(); break;
                case "password":
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