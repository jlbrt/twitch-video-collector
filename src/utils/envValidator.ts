import Joi from 'joi';

export const validateEnvironmentVars = async () => {
  const schema = Joi.object({
    DBHOST: Joi.string().required(),
    DBPORT: Joi.number().port().required(),
    DBUSER: Joi.string().required(),
    DBPASSWORD: Joi.string().required(),
    DBNAME: Joi.string().required(),
    TARGETTWITCHCHANNEL: Joi.string().required(),

    YOUTUBEAUTHTOKEN: Joi.string().required(),
  }).required();

  await schema.validateAsync(process.env, {
    abortEarly: false,
    allowUnknown: true,
  });
};
