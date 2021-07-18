const {src, dest, task, watch, series, parallel} = require('gulp')
const stylus = require('gulp-stylus')
const uglify = require('gulp-uglify')
const data = require('gulp-data')
const pug = require('gulp-pug')
const inject = require('gulp-inject')
const fs = require('fs')
const glob = require('glob-base')
const expand = require('minimatch').braceExpand

const dirs = {
  src: './src/',
  out: './build/'
}

const sources = {
  styles: 'styles/*.styl',
  scripts: 'scripts/*.js',
  pug: '*.pug',
  files: '{favicon.ico,images/**/*}' // Grouping with {} will expand
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
  src(srcPath(sources.pug))
    .pipe(inject(
      src(srcPath(sources.styles))
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
    .pipe(dest(outPath(sources.pug)))
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
  _watch(srcPath(expand(sources.files)), series('files'))
  _watch(srcPath([sources.styles, sources.scripts, sources.pug], series('html')))
})

//
// Build is the default task
//

task('default', series('build'))

//
// Build and watch task
//

task('build-and-watch', series('build', 'watch'))