import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    DB_URI: Joi.string().required(),
    DB_TEST_URI: Joi.string().required(),
});
