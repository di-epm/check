module.exports = {
  sets: {
    desktop: {
      files: 'tests'
    }
  },

  browsers: {
    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
      },
      compositeImage: true,
    }
  }
};
