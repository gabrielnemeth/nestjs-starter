import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
    DB_URI: Joi.string().required(),
    DB_TEST_URI: Joi.string().required(),
    JWT_ACCESS_SECRET_KEY: Joi.string().required(),
    JWT_REFRESH_SECRET_KEY: Joi.string().required(),
    JWT_ACCESS_EXPIRE_IN_SECONDS: Joi.number().required(),
    JWT_REFRESH_EXPIRE_IN_SECONDS: Joi.number().required(),
    FRONTEND_BASE_URL: Joi.string().required(),
});
