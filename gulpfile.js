const {src, dest, task, watch, series, parallel} = require('gulp')
const stylus = require('gulp-stylus')
const uglify = require('gulp-uglify')
const pug = require('gulp-pug')
const data = require('gulp-data')
const inject = require('gulp-inject')
const fs = require('fs')
const glob = require('glob-base')
const { braceExpand } = require('minimatch')

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
  dirs.out + glob(x).base
)

//
// Static files (just move them)
//

task('files', () => (
  src(srcPath(sources.files))
    .pipe(dest(dirs.out))
))

//
// Build the HTML from the Pug source files while injecting minified CSS and javascript into the HTML
//

const injectContents = (tagName) => (
  (path, file) => '<' + tagName + '>' + file.contents.toString('utf8') + '</' + tagName + '>'
)

task('html', () => (
  src(srcPath(sources.pug.compile))
    .pipe(inject(
      src(srcPath(sources.styles.compile))
        .pipe(stylus({ compress: true })
      ), {
        transform: injectContents('style')
      }
    ))
    .pipe(inject(
      src(srcPath(sources.scripts))
        .pipe(uglify()
      ), {
        transform: injectContents('script')
      }
    ))
    .pipe(data(config)) // Inject configuration settings into pug context
    .pipe(pug())
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
  //
  // Task watch wrapper function that prevents the gulp process from quitting due to an error
  //
  function _watch(glob, arg1, arg2) {
    watch(glob, arg1, arg2)
      .on('error', () => this.emit('end'))
  }

  _watch('./config.json', series('build'))
  _watch(srcPath(braceExpand(sources.files)), series('files'))
  _watch(
    srcPath([sources.styles.watch, sources.scripts, ...braceExpand(sources.pug.watch)]), series('html')
  )
})

//
// Build is the default task
//

task('default', series('build'))

//
// Build and watch task
//

task('build-and-watch', series('build', 'watch'))