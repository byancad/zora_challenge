/** @type {import('next').NextConfig} */
const withGraphql = require("next-graphql-loader");

const nextJsConfig = {
  reactStrictMode: true,
  env: {
    ZORA_GRAPHQL_URL: process.env.ZORA_GRAPHQL_URL,
    API_BASE_URL: process.env.API_BASE_URL,
    IRON_SESSION_PASSWORD: process.env.IRON_SESSION_PASSWORD,
    PINATA_BASE_URL: process.env.PINATA_BASE_URL,
    PINATA_API_KEY: process.env.PINATA_API_KEY,
    PINATA_SECRET_KEY: process.env.PINATA_SECRET_KEY,
    RALLY_ENDPOINT: process.env.RALLY_ENDPOINT,
    ENCRYPT_SECRET: process.env.ENCRYPT_SECRET,
    INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID,
    INFURA_PROJECT_ID: process.env.INFURA_PROJECT_SECRET,
    TRANSAK_BASE_URL: process.env.TRANSAK_BASE_URL,
    TRANSAK_API_KEY: process.env.TRANSAK_API_KEY
  }
};

module.exports = withGraphql(nextJsConfig);
