const joi = require('joi');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const envSchema = joi.object({
  PORT: joi.number().default(5000),
  MONGO_URI: joi.string().required().description('MongoDB connection string'),
  JWT_SECRET: joi.string().required().description('JWT secondary secret'),
  JWT_REFRESH_SECRET: joi.string().required().description('JWT refresh token secret'),
  JWT_EXPIRES_IN: joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: joi.string().default('7d'),
  UPLOAD_DIR: joi.string().default('uploads'),
  CLIENT_URL: joi.string().uri().required().description('Frontend client URL'),
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
  nodeEnv: envVars.NODE_ENV
};
