const joi = require('joi');
const dotenv = require('dotenv');
const path = require('node:path');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const envSchema = joi.object({
  PORT: joi.number().default(5000),
  MONGO_URI: joi.string().required().description('MongoDB connection string'),
  JWT_SECRET: joi.string().required().description('JWT secondary secret'),
  JWT_REFRESH_SECRET: joi.string().required().description('JWT refresh token secret'),
  JWT_EXPIRES_IN: joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: joi.string().default('7d'),
  UPLOAD_DIR: joi.string().default('uploads'),
  CLIENT_URL: joi.string().uri().required().description('Frontend client URL'),
  CLAIMANT_EMAILJS_SERVICE_ID: joi.string().allow('').optional(),
  CLAIMANT_EMAILJS_TEMPLATE_ID: joi.string().allow('').optional(),
  CLAIMANT_EMAILJS_PUBLIC_KEY: joi.string().allow('').optional(),
  CLAIMANT_EMAILJS_PRIVATE_KEY: joi.string().allow('').optional(),
  CLAIMANT_EMAILJS_ACCESS_TOKEN: joi.string().allow('').optional(),
  EMAILJS_PRIVATE_KEY: joi.string().allow('').optional(),
  CLAIMANT_EMAILJS_FROM_NAME: joi.string().allow('').optional(),
  NODE_ENV: joi.string().valid('development', 'production', 'test').default('development')
}).unknown().required();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  port: envVars.PORT,
  mongoUri: envVars.MONGO_URI,
  jwtSecret: envVars.JWT_SECRET,
  jwtRefreshSecret: envVars.JWT_REFRESH_SECRET,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,
  jwtRefreshExpiresIn: envVars.JWT_REFRESH_EXPIRES_IN,
  uploadDir: envVars.UPLOAD_DIR,
  clientUrl: envVars.CLIENT_URL,
  emailjsServiceId: envVars.CLAIMANT_EMAILJS_SERVICE_ID,
  emailjsTemplateId: envVars.CLAIMANT_EMAILJS_TEMPLATE_ID,
  emailjsPublicKey: envVars.CLAIMANT_EMAILJS_PUBLIC_KEY,
  emailjsPrivateKey:
    (envVars.CLAIMANT_EMAILJS_PRIVATE_KEY || '').trim() ||
    (envVars.CLAIMANT_EMAILJS_ACCESS_TOKEN || '').trim() ||
    (envVars.EMAILJS_PRIVATE_KEY || '').trim(),
  emailjsFromName: envVars.CLAIMANT_EMAILJS_FROM_NAME,
  nodeEnv: envVars.NODE_ENV
};
