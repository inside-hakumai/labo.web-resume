const { src, dest, watch, task, series, parallel } = require('gulp');
const sass = require("gulp-sass");
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');

const rimraf = require('rimraf');

function clean(cb) {
  rimraf('./dist', cb);
}

function css() {
  return src("src/stylesheets/style.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(dest("dist/css"));
}

function lib_css() {
  return src("node_modules/normalize.css/normalize.css")
    .pipe(dest("css"));
}

function js() {
  return src('src/scripts/main.ts', { sourcemaps: true })
    .pipe(ts())
    .pipe(dest('dist/js'));
}

task('watch', function() {
  watch(
    [
      'src/scripts/*.ts',
      'src/stylesheets/*.scss',
      'index.html'
    ], parallel(js, css, lib_css)
  )
});

exports.js = js;
exports.css = css;
exports.lib_css = lib_css;

const build = parallel(css, js, lib_css);
exports.default = series(clean, build);
