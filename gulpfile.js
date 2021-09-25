const { src, dest, task, watch, series, parallel } = require('gulp')
const stylus = require('gulp-stylus')
const pug = require('gulp-pug')
const merge = require('merge2')
const filter = require('gulp-filter')
const inject = require('gulp-inject')
const { createGulpEsbuild } = require('gulp-esbuild')
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

function abort(message) {
  console.error(c.red('!!'), message)
  process.exit(1)
}

//
// Site configuration
//

if (!fs.existsSync('./config.json'))
  abort("config.json needs to be present")

const config = require('./config.json')

if (config.backend.base_url === '')
  abort("Please configure the server endpoint in config.json")

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

const esbuild = createGulpEsbuild({
  piping: true
})

task('html', () => {
  const assetsFilter = filter('vendor/**', {restore: true})

  return src(srcPath(sources.pug.compile))
    .pipe(
      pug({
        // Make configuration settings available as local pug variables
        locals: config,
        // Namespace provided local variables as `self.*`
        self: true
      })
    )
    .pipe(inject(
      merge([
        //
        // Build local styles and be ready to inject them into the HTML document
        //
        src(srcPath(sources.styles.compile))
          .pipe(stylus({ compress: true })),

        //
        // Build script and style bundles and be ready to inject them into the HTML document
        //
        src(srcPath(sources.scripts))
          .pipe(esbuild({
              outfile: 'bundle.js',
              bundle: true,
              loader: {
                // Treat these as static files required by dependencies
                '.png': 'file',
                '.woff': 'file',
                '.woff2': 'file',
                '.ttf': 'file',
                '.eot': 'file',
                '.svg': 'file'
              },
              // If we add '-[hash]' to the file name template it will prevent possible name collisions, however
              // it will also break leaflet's unconventional manipulation of asset urls at runtime
              assetNames: 'vendor/[name]',
              sourcemap: config.development ? 'inline' : false,
              sourcesContent: true,
              minify: !config.development
            })
          )
          // Take just the asset files and put them in the output directory
          .pipe(assetsFilter)
          .on("data", (file) => {
            console.log(c.yellow("Including third-party file:"), "vendor/" + file.basename)
          })
          .pipe(dest(dirs.out))
          // Bring back the bundles built by esbuild for injection into the HTML
          .pipe(assetsFilter.restore)
      ]),
      {
        // Inline file contents into the correct place in the rendered HTML (automatically based on file extension)
        transform: (path, file) => file.contents.toString('utf8'),
        // Remove placeholder tags when finished
        removeTags: true
      }
    ))
    .on("data", (file) => { console.log(c.yellow("Built:"), file.basename) } )
    .pipe(dest(outPath(sources.pug.compile)))
})

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
  _watch(
    srcPath(braceExpand(sources.files)),
    series('files')
  )
  _watch(
    srcPath([
        sources.styles.watch,
        sources.scripts,
        ...braceExpand(sources.pug.watch)
    ]),
    series('html')
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