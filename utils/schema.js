const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(1),
        image: Joi.string().allow("", null),
        category: Joi.string()
            .valid(
                "trending",
                "rooms",
                "iconic",
                "mountains",
                "castles",
                "camping",
                "farms",
                "arctic",
                "domes",
                "pools"
            )
            .required()
            .messages({
                "any.only": "Invalid category selected",
                "any.required": "Category is required"
            })
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required()
    }).required()
});