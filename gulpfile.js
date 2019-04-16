const { src, dest, series, parallel } = require('gulp');
const sass = require("gulp-sass");
const ts = require('gulp-typescript');

const rimraf = require('rimraf');

function clean(cb) {
  rimraf('./dist', cb);
}

function css() {
  return src("src/stylesheets/style.scss")
    .pipe(sass())
    .pipe(dest("dist/css"));
}

function js() {
  return src('src/scripts/main.ts', { sourcemaps: true })
    .pipe(ts())
    .pipe(dest('dist/js'));
}

exports.js = js;
exports.css = css;

const build = parallel(css, js);
exports.default = series(clean, build);
