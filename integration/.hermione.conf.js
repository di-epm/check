module.exports = {
  sets: {
    desktop: {
      files: 'tests'
    }
  },

  browsers: {
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome' // this browser should be installed on your OS
      }
    }
  }
};
