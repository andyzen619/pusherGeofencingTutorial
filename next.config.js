/* next.config.js */

const webpack = require('webpack');
require('dotenv').config();

//* Allows for our environment variables to be accessed via process.env
module.exports = {
  webpack: config => {
    const env = Object.keys(process.env).reduce((acc, curr) => {
      acc[`process.env.${curr}`] = JSON.stringify(process.env[curr]);
      return acc;
    }, {});

    config.plugins.push(new webpack.DefinePlugin(env));

    return config;
  }
};