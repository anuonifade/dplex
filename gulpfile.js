
const gulp = require('gulp'),
  connect = require('gulp-connect'),
  eslint = require('gulp-eslint'),
  rename = require('gulp-rename'),
  coveralls = require('gulp-coveralls'),
  browserify = require('gulp-browserify'),
  browserSync = require('browser-sync').create();

gulp.task('scripts', () => {
  gulp.src('./spec/InvertedIndex.spec.js')
  .pipe(browserify())
  .pipe(rename('bundle.js'))
  .pipe(gulp.dest('./build'));
});

gulp.task('watch', () => {
  gulp.watch('./src/*.js', ['reload']);
  gulp.watch('./src/public/css/*.css', ['reload']);
  gulp.watch('*.html', ['reload']);
});

gulp.task('test', ['pre-test'], () => (
  gulp.src('spec/*.js')
    .on('end', () => {
      gulp.src('coverage/lcov.info')
        .pipe(coveralls());
    })
));

gulp.task('serve', ['watch'], () => {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('lint', () => {
  gulp.src(['src/InvertedIndex.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test-watch', () => {
  gulp.watch('spec/*.js', ['test-reload']);
});

gulp.task('test-reload', () => {
  gulp.src(['spec/*.js']).pipe(connect.reload());
});

gulp.task('connect', () => {
  connect.server({
    root: '.',
    livereload: true,
    port: process.env.PORT || 3000
  });
});

gulp.task('reload', () => {
  gulp.src(
    ['*.html',
      'src/*.js',
      '*.css'
    ]).pipe(connect.reload());
});

gulp.task('default',
  [
    'scripts',
    'reload',
    'test-watch',
    'test-reload',
    'connect',
    'watch'
  ]);
