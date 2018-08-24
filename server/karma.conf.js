module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      // app data
      'src/js/data.js',

      // joint
      'src/lib/js/jquery-3.3.1.min.js',
      'src/lib/js/lodash.js',
      'src/lib/js/backbone.js',
      'src/lib/js/joint.min.js',

      // external scripts
      'src/lib/js/sha512.js',
      'src/lib/js/download.js',

      // models
      'src/js/Model/db.js',
      'src/js/Model/server.js', // todo test

      // errors
      'src/js/Controller/ErrorHandler.js',

      // utils
      'src/js/Utils/open.js',
      'src/js/Utils/validate.js',
      'src/js/Utils/misc.js', // todo test

      // facade for HTML elements
      'src/js/View/Button.js', // todo test
      'src/js/View/Cell.js', // todo test
      'src/js/View/Link.js', // todo test

      // command handler
      'src/js/Model/Commands.js', // todo test
      'src/js/Controller/OperationHandler.js', // todo test

      // shapes
      'src/js/Model/RobustnessModels/shapes.js', // todo test
      'src/js/Model/RobustnessModels/links.js', // todo test
      'src/js/Model/RobustnessModels/RobustnessModel.js', // todo test
      'src/js/Model/Paper.js', // todo test

      // shapes handler
      'src/js/Utils/prettify.js',
      'src/js/Controller/ElementHandler.js', // todo test
      'src/js/View/EditorEventsManager.js', // todo test
      'src/js/View/DragAndDrop.js', // todo test

      // app
      'src/js/View/EditorLoader.js', // todo test
      'src/js/init.js', // todo test
      'src/js/app.js', // todo test

      // actual tests
      'spec/client/*_spec.js',  // js
      'spec/client/*_spec.html'  // html
    ],
    plugins: [
      'karma-html2js-preprocessor',
      'karma-coverage',
      'karma-jasmine',
      'karma-phantomjs-launcher'
    ],
    preprocessors: {
      // html
      'spec/client/*_spec.html': ['html2js'],

      // coverage
      // data
      'src/js/data.js': ['coverage'],

      // models
      'src/js/Model/db.js': ['coverage'],
      'src/js/Model/server.js': ['coverage'],

      // errors
      'src/js/Controller/ErrorHandler.js': ['coverage'],

      // utils
      'src/js/Utils/open.js': ['coverage'],
      'src/js/Utils/validate.js': ['coverage'],
      'src/js/Utils/misc.js': ['coverage'],

      // facade for HTML elements
      'src/js/View/Button.js': ['coverage'],
      'src/js/View/Cell.js': ['coverage'],
      'src/js/View/Link.js': ['coverage'],

      // controls
      'src/js/Model/Commands.js': ['coverage'],
      'src/js/Controller/OperationHandler.js': ['coverage'],

      // shapes
      'src/js/Model/RobustnessModels/shapes.js': ['coverage'],
      'src/js/Model/RobustnessModels/links.js': ['coverage'],
      'src/js/Model/RobustnessModels/RobustnessModel.js': ['coverage'],
      'src/js/Model/Paper.js': ['coverage'],

      // shapes handler
      'src/js/Utils/prettify.js': ['coverage'],
      'src/js/Controller/ElementHandler.js': ['coverage'],
      'src/js/View/EditorEventsManager.js': ['coverage'],
      'src/js/View/DragAndDrop.js': ['coverage'],

      // app
      'src/js/View/EditorLoader.js': ['coverage'],
      'src/js/init.js': ['coverage'], // todo enable
      'src/js/app.js': ['coverage'] // todo enable
    },
    reporters: ['progress', 'coverage'],
    port: 9878,
    colors: true,
    logLevel: config.LOG_DISABLE,
    autowatch: true,
    browsers: ['PhantomJS'],
    singleRun: true,
    concurrency: Infinity,
    coverageReporter: {
      includeAllSources: true,
      dir: '../tests/client/coverage/',
      reporters: [
        {type: 'html', subdir: 'html'},
        {type: 'text-summary'}
      ]
    }
  })
}
