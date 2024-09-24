import WarningsFilterPlugin from 'webpack-filter-warnings-plugin';

module.exports = {
  plugins: [
    new WarningsFilterPlugin([
      {
        module: /flowbite-react/, 
        message: /Failed to parse source map/,
      },
    ]),
  ],
};