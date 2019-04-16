const fs = require('fs');
const { src, dest, watch, task, series, parallel } = require('gulp');
const sass = require("gulp-sass");
const ts = require('gulp-typescript');
const ejs = require('gulp-ejs');
const sourcemaps = require('gulp-sourcemaps');

const rimraf = require('rimraf');

const contents = JSON.parse(fs.readFileSync('./contents.json', 'utf8'));

function clean(cb) {
  rimraf('./dist', cb);
}

// function css() {
//   return src("src/stylesheets/style.scss")
//     .pipe(sourcemaps.init())
//     .pipe(sass())
//     .pipe(sourcemaps.write())
//     .pipe(dest("dist/css"));
// }

function lib_css() {
  return src("node_modules/normalize.css/normalize.css")
    .pipe(dest("dist/css"));
}

// function js() {
//   return src('src/scripts/main.ts', { sourcemaps: true })
//     .pipe(ts())
//     .pipe(dest('dist/js'));
// }

function html(cb) {
  src('src/index.ejs')
    .pipe(ejs(contents, {rmWhitespace: true}, {ext: '.html'}))
    .pipe(dest('dist'));
  cb();
}

// exports.js = js;
// exports.css = css;
exports.lib_css = lib_css;
exports.html = html;

const build = parallel(/*css, js, */lib_css, html);

task('watch', function() {
  watch(
    [
      'src/**/*',
    ], build
  )
});

exports.default = series(clean, build);
