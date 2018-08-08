/////////////////////////////////////////////////////////////////
/// GULPFILE.JS CREATED BY ALEXEY KUZNECOV
///
///////////////////////////////////////////////////////////////
var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    wiredep = require('wiredep').stream,
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    uncss = require('gulp-uncss'),
    minifyCss = require('gulp-minify-css'),
    clean = require('gulp-clean'),
    sftp = require('gulp-sftp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    responsive = require('gulp-responsive');
///////////////////////////////////////////////////////////////
///
/// ОТСЛЕЖИВАНИЯ ФАЙЛОВ ПРОЕКТА
///
///////////////////////////////////////////////////////////////
gulp.task('watch', ['sass'], function() {
   gulp.watch('bower.json', ['bower']);
   gulp.watch('app/sass/**/*.sass', ['sass'])
   gulp.watch('app/*.html', browserSync.reload);
   gulp.watch('app/js/**/*.js', browserSync.reload);
});
///////////////////////////////////////////////////////////////
///
/// КОМПИЛЯТОР SASS
///
///////////////////////////////////////////////////////////////
gulp.task('sass', function() {
   return gulp.src('app/sass/**/*.sass')
   .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
   .pipe(autoprefixer({
      browsers: ['last 3 versions','> 1%','ie 7','ie 8'],
      cascade: false }))
   .pipe(gulp.dest('app/css'))
   .pipe(browserSync.reload({ stream: true }))
});
///////////////////////////////////////////////////////////////
///
/// ЗАДАЧА: ОТЧИСТИТЬ ФАЙЛЫ CSS ОТ НЕИСПОЛЬЗОВАННЫХ СТИЛЕЙ
///
///////////////////////////////////////////////////////////////
gulp.task('uncss', function () {
    return gulp.src('app/css/*.css')
        .pipe(uncss({
            html: ['app/index.html', 'posts/**/*.html']
        }))
        .pipe(gulp.dest('app/css/'));
});
///////////////////////////////////////////////////////////////
///
/// BOWER — АВТОПОДКЛЮЧЕНИЯ БИБЛОТЕК
///
///////////////////////////////////////////////////////////////
gulp.task('bower', function () {
  gulp.src('./app/index.html')
    .pipe(wiredep({
      directory : "./app/bower"
    }))
    .pipe(gulp.dest('./app'));
});
///////////////////////////////////////////////////////////////
///
/// ЗАДАЧА: КОНВЕРТИРОВАНИЕ ИЗОБРАЖЕНИЙ И ОПТИМИЗАЦИЯ
///
///////////////////////////////////////////////////////////////
gulp.task('imghandler', function () {
  return gulp.src('app/img/origin/*.{png,jpg}')
    .pipe(responsive({
    '*.png': [
      {
        width: 256,
        rename: { suffix: '_256px', extname: '.jpg', },
        format: 'jpeg',
      },
      {
        width: 512,
        rename: { suffix: '_512px', extname: '.jpg', },
      },
      {
        width: 1024,
        rename: { suffix: '_1024px', extname: '.jpg', },
        withoutEnlargement: true,
      },
      {
        width: 630,
        rename: {suffix: '_630px', extname: '.webp', },
      }],
    },
    {
      // Global configuration for all images
      // The output quality for JPEG, WebP and TIFF output formats
      quality: 80,
      // Use progressive (interlace) scan for JPEG and PNG output
      progressive: true,
      // Strip all metadata
      withMetadata: false,
      // Do not emit the error when image is enlarged.
      errorOnEnlargement: false,
    })).pipe(gulp.dest('app/img/.out/'));
});
///////////////////////////////////////////////////////////////
///
/// ЗАДАЧА: ЗАПУСК СЕРВЕРА
///
///////////////////////////////////////////////////////////////
gulp.task('bsync', function() {
   browserSync({
      server: { baseDir: 'app' },
      notify: false
   });
});
///////////////////////////////////////////////////////////////
///
/// УДАЛЕНИЕ СТАРОЙ ВЕРССИ ПРОЕКТА ПЕРЕД СБОРКОЙ
///
///////////////////////////////////////////////////////////////
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});
///////////////////////////////////////////////////////////////
///
/// ЗАДАЧА: СОБРАТЬ ПРОЕКТ
///
///////////////////////////////////////////////////////////////
gulp.task('build', ['clean','uncss'], function () {
    // Сборка html, css и js файлов
    var build = gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist'));
    // Сборка изображений
    var buildImg = gulp.src('app/img/*.{png,jpg}')
    .pipe(gulp.dest('dist/img'));
    // Сборка шрифтов
    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});
///////////////////////////////////////////////////////////////
///
/// ЗАДАЧА ПОУМОЛЧАНИЮ
///
///////////////////////////////////////////////////////////////
gulp.task('default', ['watch', 'bsync']);
