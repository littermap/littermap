var gulp   = require('gulp'),
    stylus = require('gulp-stylus'),
    data   = require('gulp-data'),
    pug    = require('gulp-pug'),
    fs     = require('fs'),
    glob   = require('glob-base'),
    expand = require('minimatch').braceExpand

var dirs = {
  src: './src/',
  out: './build/'
}

var sources = {
  styles: 'styles/**/*.styl',
  scripts: 'scripts/**/*.js',
  pug: '*.pug',
  files: '{favicon.ico,images/**/*}' // Grouping with {} will expand
}

//
// Site configuration
//

var config = require('./config.json')

//
// Construct full source path
//

function srcPath(x) {
  return Array.isArray(x) ?
    x.map(path => dirs.src + path)
    : dirs.src + x
}

//
// Construct associated output directory for a source path
//

function outPath(x) {
  return dirs.out + glob(x).base
}

//
// Static files (just move them)
//

gulp.task('files', () => {
  return gulp.src(srcPath(sources.files))
    .pipe(gulp.dest(dirs.out))
})

//
// Build the CSS from the Stylus source files
//

gulp.task('styles', () => {
  return gulp.src(srcPath(sources.styles))
    .pipe(stylus({ compress: true }))
    .pipe(gulp.dest(outPath(sources.styles)))
})

//
// Build the HTML files from the Pug source files
//

gulp.task('pug', () => {
  return gulp.src(srcPath(sources.pug))
    .pipe(data(config)) // Inject configuration settings into pug context
    .pipe(pug())
    .pipe(gulp.dest(outPath(sources.pug)))
})

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