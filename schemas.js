const Joi = require('joi');
const {number } = require('joi');
// const sanitizeHtml = require('sanitize-html')

// const { sanitizeFilter } = require('mongoose');
// const extension = (joi) =>({
//     type: 'string',
//     base: joi.string(),
//     messages: {
//         'string.escapeHTML': '{{#label}} must not include HTML!'
//     },
//     rules: {
//         escapeHTML: {
//             validate(value,helpers){
//                 const clean = sanitizeHTML(value, {
//                     allowedTags: [],
//                     allowedAttributes: {},
//                 });
//                 if(clean!== value) return helpers.console.error('string.escapeHTML', {value});
//                 return clean;
//             }
//         }
//     }
// });


module.exports.CampgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()

    }).required(),
    deleteImages: Joi.array()
});



module.exports.reviewSchema = Joi.object({
    review: Joi.object({
      rating: Joi.number().required().min(0).max(5),
      body: Joi.string().required()
    }).required()
  });