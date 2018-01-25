// karma.conf.js
module.exports = function (config) {
  config.set({
    frameworks: ['browserify', 'tap'],
    files: ['test/ui/*.test.js'],
    preprocessors: {
      'test/ui/*.test.js': [ 'browserify' ]
    },
    browserify: {
      debug: true,
      plugin: [ 'proxyquireify/plugin' ],
      transform: [ 'brfs' ]
    },
    colors: true,
    browsers: ['ChromeHeadless'],
    singleRun: true
  })
}
