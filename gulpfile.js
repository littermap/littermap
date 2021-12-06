const { src, dest, task, watch, series, parallel } = require('gulp')
const stylus = require('gulp-stylus')
const pug = require('gulp-pug')
const merge = require('merge2')
const filter = require('gulp-filter')
const inject = require('gulp-inject')
const { createGulpEsbuild } = require('gulp-esbuild')
const { solidPlugin } = require('esbuild-plugin-solid')
const fs = require('fs')
const { braceExpand } = require('minimatch')
const c = require('ansi-colors')

const dirs = {
  src: './src/',
  out: './build/'
}

const sources = {
  styles: {
    compile: 'styles/main.styl',
    watch: 'styles/**/*.styl'
  },
  scripts: {
    compile: 'app/render.jsx',
    watch: 'app/**/*'
  },
  pug: {
    compile: 'index.pug',
    watch: '*.pug'
  },
  files: '{favicon.ico,images/**/*}'
}

function abort(message) {
  console.error(c.red('!!'), message)
  process.exit(1)
}

//
// Global configuration
//

let config

const readConfig = () => {
  if (!fs.existsSync('./config.json'))
    abort("config.json needs to be present")

  config = JSON.parse(
    fs.readFileSync('./config.json')
  )
}

readConfig()

//
// Judiciously introduce relevant configuration options into the application code
//

const appConfig = (config) => ({
  title: config.title,
  backend: {
    api: config.backend.api,
    media: config.backend.media,
  },
  credentials: {
    mapbox: {
      access_token: config.map.mapbox.access_token,
    }
  },
  development: config.development,
  debug: {
    upload_info: config.debug.upload_info
  },
  map: {
    default_zoom: config.map.default_zoom,
    min_add_location_zoom: config.map.min_add_location_zoom,
    long_click_interval: config.map.long_click_interval,
    data_update_debounce: config.map.data_update_debounce
  },
  location: {
    max_uploads: config.location.max_uploads,
    max_file_size: config.location.max_file_size
  }
})

//
// Construct full source path
//

const srcPath = (x) => (
  Array.isArray(x) ?
    x.map(path => dirs.src + path)
    : dirs.src + x
)

//
// Static files (just move them)
//

task('files', () => (
  src(srcPath(sources.files))
    .pipe(dest(dirs.out))
))

//
// Build the HTML from the Pug source files and then inline the styles and scripts into the HTML document
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
        src(srcPath(sources.scripts.compile))
          .pipe(esbuild({
              outdir: './',
              bundle: true,
              plugins: [
                solidPlugin()
              ],
              loader: {
                // Treat these as static files required by dependencies
                '.png': 'file',
                '.woff': 'file',
                '.woff2': 'file',
                '.ttf': 'file',
                '.eot': 'file',
                '.svg': 'file'
              },
              assetNames: 'vendor/[name]-[hash]',
              sourcemap: config.development ? 'inline' : false,
              sourcesContent: true,
              minify: !config.development,
              define: {
                config: JSON.stringify(
                  appConfig(config)
                )
              }
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
    // Prevents errors from crashing the watch task
    .on('error', (e) => e.end())
    .pipe(dest(dirs.out))
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

  // Paths can be an array of path definitions or a single string and those definitions can have globs
  function _watch(paths, task, onChanged) {
    watch(paths, { events: "all" }, task)
      .on('change', (file) => {
        onChanged && onChanged()

        // Print which file has been modified
        console.log('\n', c.green('!! File touched:'), file, '\n')
      })

    watching.push(paths)
  }

  // Use a glob to force directory level watching (bug in 'chokidar' 2.x, see issue #237)
  // When 'glob-watcher' switches to 'chokidar' 3.x this workaround won't be necessary (see issue #49)
  _watch('./config.json*', series('build'), readConfig)
  _watch(
    // Expand braces {} into an array of paths with braceExpand()
    srcPath(braceExpand(sources.files)),
    series('files')
  )
  _watch(
    srcPath([
        sources.styles.watch,
        sources.scripts.watch,
        sources.pug.watch
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