var gulp   = require('gulp'),
    stylus = require('gulp-stylus'),
    data   = require('gulp-data'),
    pug    = require('gulp-pug'),
    fs     = require('fs'),
    glob   = require('glob-base')

var dirs = {
  src: './src/',
  out: './build/'
}

var paths = {
  config: 'config.json',
  styles: 'styles/**/*.styl',
  scripts: 'scripts/**/*.js',
  pug: '*.pug',
  files: [
    'favicon.ico',
    '+(images)/**/*'
  ]
}

//
// Site configuration
//

var config = JSON.parse(fs.readFileSync(paths.config))

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
  return gulp.src(srcPath(paths.files))
    .pipe(gulp.dest(dirs.out))
})

//
// Build the CSS from the Stylus source files
//

gulp.task('styles', () => {
  return gulp.src(srcPath(paths.styles))
    .pipe(stylus({ compress: true }))
    .pipe(gulp.dest(outPath(paths.styles)))
})

//
// Build the HTML files from the Pug source files
//

gulp.task('pug', () => {
  return gulp.src(srcPath(paths.pug))
    .pipe(data(config)) // Inject configuration settings into pug context
    .pipe(pug())
    .pipe(gulp.dest(outPath(paths.pug)))
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

  gulpWatch(paths.config, gulp.series('build'))
  gulpWatch(srcPath(paths.files), gulp.series('files'))
  gulpWatch(srcPath(paths.styles), gulp.series('styles'))
  gulpWatch(srcPath(paths.scripts), gulp.series('pug'))
  gulpWatch(srcPath(paths.pug), gulp.series('pug'))
})

//
// Build is the default task
//

gulp.task('default', gulp.series('build'))

//
// Build and watch task
//

gulp.task('build-and-watch', gulp.series('build', 'watch'))