const Joi = require("joi");
const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(6).max(50).required().email(),
        password: Joi.string().min(6).max(50).required(),
        role: Joi.string().required().valid("employer", "employee")
    });
    return schema.validate(data);
};
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).max(50).required().email(),
        password: Joi.string().min(6).max(50).required()
    });
    return schema.validate(data);
};
const jobValidation = (data) => {
    const schema = Joi.object({
        jobname: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(6).max(2000).required(),
        // hours: Joi.number().min(1).max(10000).required(),
        price: Joi.number().min(1).max(10000).required(),
    });
    return schema.validate(data);
};
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.jobValidation = jobValidation;