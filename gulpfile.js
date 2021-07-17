const gulp = require('gulp')
const stylus = require('gulp-stylus')
const data = require('gulp-data')
const pug = require('gulp-pug')
const fs = require('fs')
const glob = require('glob-base')
const expand = require('minimatch').braceExpand

const dirs = {
  src: './src/',
  out: './build/'
}

const sources = {
  styles: 'styles/**/*.styl',
  scripts: 'scripts/**/*.js',
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
// Build the CSS from the Stylus source files
//

gulp.task('styles', () => (
  gulp.src(srcPath(sources.styles))
    .pipe(stylus({ compress: true }))
    .pipe(gulp.dest(outPath(sources.styles)))
))

//
// Build the HTML files from the Pug source files
//

gulp.task('pug', () => (
  gulp.src(srcPath(sources.pug))
    .pipe(data(config)) // Inject configuration settings into pug context
    .pipe(pug())
    .pipe(gulp.dest(outPath(sources.pug)))
))

//
// Task to build the website
//

gulp.task('build', gulp.series('files', 'styles', 'pug'))

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
  gulpWatch(srcPath(sources.styles), gulp.series('styles'))
  gulpWatch(srcPath(sources.scripts), gulp.series('pug'))
  gulpWatch(srcPath(sources.pug), gulp.series('pug'))
})

//
// Build is the default task
//

gulp.task('default', gulp.series('build'))

//
// Build and watch task
//

gulp.task('build-and-watch', gulp.series('build', 'watch'))