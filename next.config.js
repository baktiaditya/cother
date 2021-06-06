const withPlugins = require('next-compose-plugins');
const images = require('next-images');

const nextConfig = {
  webpack: config => {
    config.module.rules.push({
      test: /\.txt$/i,
      use: 'raw-loader',
    });

    return config;
  },
};

module.exports = withPlugins([[images]], nextConfig);
