var gulp = require('gulp');
var tslint = require('gulp-tslint');
var typescript = require('gulp-tsc');
var plumber = require('gulp-plumber');
var del = require('del');

//Compilation
gulp.task('compile', function () {
  return gulp.src('ts/**/*.ts')
    .pipe(plumber(function () {}))
    .pipe(tslint({
      configuration: {
        rules: {
          "no-any": true,
          "no-string-literal": true,
          "no-optional-parameters": true
        },
        rulesDirectory: "rules"
      }
    }))
    .pipe(tslint.report('verbose'))
    .pipe(typescript({
      target: "ES6"
    }))
    .pipe(gulp.dest('build/'));
});

//For writing more TSLint Rules
gulp.task('compile:rules', function () {
  gulp.src(['ts/rules/**/*.ts'])
    .pipe(typescript({
      target: "ES6"
    }))
    .pipe(gulp.dest('rules/'));
});

gulp.task('default', ['compile'], function () {
  console.log("Successfully Built!");
});

gulp.task("watch", function () {
  gulp.watch('ts/**/*.ts', ['default']);
});

gulp.task('clean', function (cb) {
  del(['build/*', 'build'], cb);
});