const {src, dest, task, watch, series, parallel} = require('gulp')
const stylus = require('gulp-stylus')
const pug = require('gulp-pug')
const terser = require('gulp-terser-js')
const gulpif = require('gulp-if')
const source = require('vinyl-source-stream')
const buffer = require('gulp-buffer')
const lazypipe = require('lazypipe')
const browserify = require('browserify')
const browserifyCSS = require('browserify-css')
const data = require('gulp-data')
const inject = require('gulp-inject')
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const globBase = require('glob-parent')
const { braceExpand } = require('minimatch')
const c = require('ansi-colors')
const log = require('fancy-log')

const dirs = {
  src: './src/',
  out: './build/'
}

const sources = {
  styles: {
    compile: 'styles/*.styl',
    watch: 'styles/**/*.styl'
  },
  scripts: 'scripts/*.js',
  pug: {
    compile: '*.pug',
    watch: '{*.pug,lib/**/*.pug}'
  },
  files: '{favicon.ico,images/**/*}' // Braces {} can be expanded into an array with braceExpand()
}

//
// Site configuration
//

const config = require('./config.json')

//
// Construct full source path
//

const srcPath = (x) => (
  Array.isArray(x) ?
    x.map(path => dirs.src + path)
    : dirs.src + x
)

//
// Construct associated output directory for a source path
//

const outPath = (x) => (
  dirs.out + globBase(x)
)

//
// Static files (just move them)
//

task('files', () => (
  src(srcPath(sources.files))
    .pipe(dest(dirs.out))
))

//
// Build the HTML from the Pug source files and then inline the minified styles and scripts into the HTML document
//

const injectFileContents = (tag) => (
  (path, file) =>
    (tag ? '<' + tag + '>' : '') + file.contents.toString('utf8') + (tag ? '</' + tag + '>' : '')
)

task('html', () => (
  src(srcPath(sources.pug.compile))
    .pipe(data(config)) // Inject configuration settings into pug context
    .pipe(pug())
    .pipe(inject(
      //
      // Compile stylus and set the minified CSS to be injected into the HTML document
      //
      src(srcPath(sources.styles.compile))
        .pipe(stylus({ compress: true })),
      {
        transform: injectFileContents('style'),
        removeTags: true,
        quiet: true
      }
    ))
    .pipe(inject(
      //
      // Package the scripts with all of their dependencies as a single bundle
      //
      browserify(glob.sync(srcPath(sources.scripts)), {
        debug: config.development // generate source maps in development builds
      })
        //
        // Integrate CSS used by the script dependencies into the bundle
        //
        // (the bundle will include script code that will insert the CSS into the document at runtime)
        //
        .transform(browserifyCSS, {
          autoInjectOptions: {
            verbose: false // opt out of adding an extra attribute when inserting the styles into the page document at runtime
          },
          rootDir: './node_modules/', // represent relative paths to external files as if already in the 'node_modules/' directory
          stripComments: true,
          inlineImages: false, // don't convert image urls to inline data because Leaflet uses unconventional methods to manipulate the urls at runtime and it doesn't work with inline data
          processRelativeUrl: (url) => {
            //
            // External files referenced by the CSS that haven't been inlined will be added to the build as static files
            //

            // Strip URL parameters from the relative path
            url = url.split('?')[0].split('#')[0]

            console.log(c.yellow("Including external file referenced by a front-end dependency:"), url)

            let srcFile = './node_modules/' + url
            let destFile = path.join(dirs.out, 'vendor/', path.dirname(url), path.basename(url))

            fs.cpSync(srcFile, destFile)

            return 'vendor/' + url
          }
        })
        .on("bundle", () => { log("Bundling runtime dependencies with browserify...") })
        .bundle()
        .pipe(source('bundle.js')) // convert into a gulp stream
        .pipe(buffer()) // the bundle created by browserify must be further processed in its complete form
        .on("data", () => { log('Script bundle built') })
        .pipe(
          gulpif(
            !config.development,
            lazypipe()
              .pipe(terser)()
              .on("data", () => { log("Scripts have been minified") })
          )
        ),
      {
        transform: injectFileContents('script'),
        removeTags: true,
        quiet: true
      }
    ))
    .pipe(dest(outPath(sources.pug.compile)))
))

//
// Task to build the website
//

task('build', parallel('files', 'html'))

//
// Task to watch file changes and trigger builds
//

task('watch', () => {
  let watching = []

  //
  // Task watch wrapper function that prevents the gulp process from quitting due to an error
  //
  function _watch(paths, arg1, arg2) {
    // Paths can be an array of path definitions or a single string and those definitions can have globs
    watch(paths, arg1, arg2)
      .on('error', () => this.emit('end'))

    watching.push(paths)
  }

  _watch('./config.json', series('build'))
  _watch(srcPath(braceExpand(sources.files)), series('files'))
  _watch(
    srcPath([sources.styles.watch, sources.scripts, ...braceExpand(sources.pug.watch)]), series('html')
  )

  console.log("\nWatching paths:\n\n" + watching.flat().join('\n') + '\n')
})

//
// Build is the default task
//

task('default', series('build'))

//
// Build and watch task
//

task('build-and-watch', series('build', 'watch'))