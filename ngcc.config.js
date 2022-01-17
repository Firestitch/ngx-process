module.exports = {
  packages: {
    '@firestitch/example': {
      ignorableDeepImportMatchers: [
        /highlight\.js/,
      ]
    },
    'ngx-highlightjs': {
      ignorableDeepImportMatchers: [
        /highlight\.js/,
      ]
    }
  }
}
