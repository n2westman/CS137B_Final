var gulp = require('gulp');
var tslint = require('gulp-tslint');
var typescript = require('gulp-tsc');
var del = require('del');

gulp.task('compile', function () {
  gulp.src(['ts/**/*.ts'])
    .pipe(typescript({
      target: "ES6"
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('compile:rules', function () {
  gulp.src(['ts/rules/**/*.ts'])
    .pipe(typescript({
      target: "ES6"
    }))
    .pipe(gulp.dest('rules/'));
});

gulp.task('tslint', function () {
  gulp.src('ts/**/*.ts')
    .pipe(tslint({
      configuration: {
        "no-any": true,
        "no-string-literal": true
      }
    }))
    .pipe(tslint.report('verbose'));
});

gulp.task("default", function () {
  console.log('running tasks...');
});

gulp.task("watch", function () {
  gulp.watch('ts/**/*.ts', function (event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});

gulp.task('clean', function (cb) {
  del(['build/*', 'build'], cb);
});