var gulp   = require('gulp'),
    merge2 = require('merge2'),
    stylus = require('gulp-stylus'),
    data   = require('gulp-data'),
    pug    = require('gulp-pug'),
    fs     = require('fs')

var dirs = {
  src: './src/',
  out: './build/'
}

var paths = {
  config: './config.json',
  styles: {
    src: 'styles/**/*.styl',
    out: 'styles'
  },
  scripts: {
    src: 'scripts/**/*.js',
    out: 'scripts'
  },
  pug: {
    src: '*.pug',
    out: ''
  },
  images: {
    src: 'images/**/*'
  },
  files: [
    ['', 'favicon.ico'],
    ['images/', '**']
  ]
}

//
// Site configuration
//

var config = JSON.parse(fs.readFileSync(paths.config))

//
// Static files (just move them)
//

gulp.task('files', () => {
  var justMove = (s, d) => gulp.src(s).pipe(gulp.dest(d))

  return merge2(
    paths.files.map(
      (map) => justMove(
        dirs.src + map[0] + map[1], dirs.out + map[0]
      )
    )
  )
})

//
// Build the CSS from the Stylus source files
//

gulp.task('styles', () => {
  return gulp.src(dirs.src + paths.styles.src)
    .pipe(stylus({ compress: true }))
    .pipe(gulp.dest(dirs.out + paths.styles.out))
})

//
// Build the HTML files from the Pug source files
//

gulp.task('pug', () => {
  return gulp.src(dirs.src + paths.pug.src)
    .pipe(data(config)) // Inject configuration settings into pug context
    .pipe(pug())
    .pipe(gulp.dest(dirs.out + paths.pug.out))
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
  gulpWatch(dirs.src + paths.styles.src, gulp.series('build'))
  gulpWatch(dirs.src + paths.scripts.src, gulp.series('pug'))
  gulpWatch(dirs.src + paths.pug.src, gulp.series('pug'))
  gulpWatch(dirs.src + paths.images.src, gulp.series('pug'))
})

//
// Build is the default task
//

gulp.task('default', gulp.series('build'))

//
// Build and watch task
//

gulp.task('build-and-watch', gulp.series('build', 'watch'))