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

// function css(cb) {
//   src("src/stylesheets/style.scss")
//     .pipe(sourcemaps.init())
//     .pipe(sass())
//     .pipe(sourcemaps.write())
//     .pipe(dest("css"));
//   cb();
// }

function lib_css(cb) {
  src([
    "node_modules/normalize.css/normalize.css",
    'node_modules/uikit/dist/css/uikit.css',
    ])
    .pipe(dest("dist/css"));
  cb();
}

// function js(cb) {
//   src('src/scripts/main.ts', {sourcemaps: true})
//     .pipe(ts())
//     .pipe(dest('js'));
//   cb();
// }

function lib_js(cb) {
  src([
    'node_modules/uikit/dist/js/uikit.js',
    'node_modules/uikit/dist/js/uikit-icons.js',
  ])
    .pipe(dest("dist/js"));
  cb();
}

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

const build = parallel(/*css, js, */lib_css, lib_js, html);

task('watch', function() {
  watch(
    [
      'src/**/*',
    ], build
  )
});

exports.default = series(clean, build);
