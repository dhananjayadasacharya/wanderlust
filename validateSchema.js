const Joi = require('joi');

const listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.string().allow("",null),
});

const reviewSchema = Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
});
module.exports = {listingSchema, reviewSchema};