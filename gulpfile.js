const fs = require('fs');
const { src, dest, watch, task, series, parallel } = require('gulp');
const sass = require("gulp-sass");
const ts = require('gulp-typescript');
const ejs = require('gulp-ejs');
const sourcemaps = require('gulp-sourcemaps');

const rimraf = require('rimraf');

const webpackStream = require("webpack-stream");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config");

const tsProject = ts.createProject('tsconfig.json');

const contents = JSON.parse(fs.readFileSync('./contents.json', 'utf8'));

function clean(cb) {
  rimraf('./dist', cb);
}

function css(cb) {
  src("src/stylesheets/style.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', function(err) {
      console.error(err);
      this.emit('end');
    })
    .pipe(sourcemaps.write())
    .pipe(dest("dist/css"));
  cb();
}

function lib_css(cb) {
  src([
    "node_modules/normalize.css/normalize.css",
    'node_modules/uikit/dist/css/uikit.css',
    'src/stylesheets/NotoSansMonoCJKjp-Regular.otf'
    ])
    .pipe(dest("dist/css"));
  cb();
}

function js(cb) {
  webpackStream(webpackConfig, webpack)
    .on('error', function(err) {
      console.error(err);
      this.emit('end');
    })
    .pipe(dest('dist/js'));
  cb();
}

// function lib_js(cb) {
//   src([
//     'src/scripts/jquery.shuffleLetters.js'
//   ])
//     .pipe(dest("js"));
//   cb();
// }

function image(cb) {
  src([
    'src/images/*'
  ])
    .pipe(dest("dist/img"));
  cb();
}

function html(cb) {
  src('src/index.ejs')
    .pipe(ejs(contents, {rmWhitespace: true}, {ext: '.html'}))
    .pipe(dest('dist'));
  cb();
}

function asset(cb) {
  src('node_modules/kuromoji/dict/*')
    .pipe(dest('dist/assets/dict/'));
  cb();
}

exports.css = css;
exports.js = js;
exports.lib_css = lib_css;
// exports.lib_js = lib_js;
exports.image = image;
exports.html = html;
exports.assert = asset;

const build = parallel(css, js, lib_css, /*lib_js, */image, html, asset);

task('watch', function() {
  watch(
    [
      'src/**/*',
    ], build
  )
});

exports.default = series(clean, build);
