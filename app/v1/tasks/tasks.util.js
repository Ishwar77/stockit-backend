const MyConst = require('../utils');
const JOI = require('@hapi/joi');

module.exports = class TasksUtil {

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

        const error = TasksUtil.getJoiVerificationModel(action, model).validate(model);
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
                task_uuid: JOI.string(),
                store_id: JOI.number(),
                task_name: JOI.string(),
                task_description: JOI.string(),
                assigned_to: JOI.string(),
                status: JOI.string(),
                comments: JOI.string(),
                created_at: JOI.date().default(new Date()),
                updated_at: JOI.date().default(new Date()),
                is_active: JOI.number().default(1),
            });
        } else {
            return JOI.object(TasksUtil.generateDynamicUpdateValidator(reqBody));
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
                case "task_uuid":
                    validator[`${prop}`] = JOI.string(); break;
                case "store_id":
                    validator[`${prop}`] = JOI.number(); break;
                case "task_name":
                    validator[`${prop}`] = JOI.string(); break;
                case "task_description":
                    validator[`${prop}`] = JOI.string(); break;
                case "assigned_to":
                    validator[`${prop}`] = JOI.string(); break;
                case "status":
                    validator[`${prop}`] = JOI.string(); break;
                case "comments":
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