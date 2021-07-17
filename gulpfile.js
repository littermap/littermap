const gulp = require('gulp')
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

gulp.task('files', () => (
  gulp.src(srcPath(sources.files))
    .pipe(gulp.dest(dirs.out))
))

//
// Build the HTML from the Pug source files while injecting minified CSS and javascript into the HTML
//

const injectContents = (tagName) => (
  (path, file) => '<' + tagName + '>' + file.contents.toString('utf8') + '</' + tagName + '>'
)

gulp.task('html', () => (
  gulp.src(srcPath(sources.pug))
    .pipe(inject(
      gulp.src(srcPath(sources.styles))
        .pipe(stylus({ compress: true })
      ), {
        transform: injectContents('style')
      }
    ))
    .pipe(inject(
      gulp.src(srcPath(sources.scripts))
        .pipe(uglify()
      ), {
        transform: injectContents('script')
      }
    ))
    .pipe(data(config)) // Inject configuration settings into pug context
    .pipe(pug())
    .pipe(gulp.dest(outPath(sources.pug)))
))

//
// Task to build the website
//

gulp.task('build', gulp.series('files', 'html'))

//
// Task to watch file changes and trigger builds
//

gulp.task('watch', () => {
  //
  // Task watch wrapper function that prevents the watch process from quitting due to an error bubbling up
  //
  function gulpWatch(glob, arg1, arg2) {
    gulp.watch(glob, arg1, arg2)
      .on('error', () => this.emit('end'))
  }

  gulpWatch('./config.json', gulp.series('build'))
  gulpWatch(srcPath(expand(sources.files)), gulp.series('files'))
  gulpWatch(srcPath(sources.styles), gulp.series('html'))
  gulpWatch(srcPath(sources.scripts), gulp.series('html'))
  gulpWatch(srcPath(sources.pug), gulp.series('html'))
})

//
// Build is the default task
//

gulp.task('default', gulp.series('build'))

//
// Build and watch task
//

gulp.task('build-and-watch', gulp.series('build', 'watch'))