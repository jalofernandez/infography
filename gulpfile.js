/*
* Dependencias
*/
   var gulp = require('gulp'),
     concat = require('gulp-concat'),
     uglify = require('gulp-uglify'),
  minifycss = require('gulp-minify-css'),
   cleanCSS = require('gulp-clean-css'),
   imagemin = require('gulp-imagemin'),
gulpIgnore  = require('gulp-ignore'),
       less = require('gulp-less'),
       path = require('path'),
        pug = require('gulp-pug'),
       data = require('gulp-data'),
         fs = require('fs'),
    sitemap = require('gulp-sitemap');

/*
* Task 'deploy' configuration: last step just before publish (compile all files & prepare to push it all!)
*/
gulp.task('deploy', ['js', 'img', 'less', 'css', 'mincss', 'pug', 'sitemap']); // task order is not random

/*
 * Task 'dev' configuration: developer mode
 */
gulp.task('dev', ['less', 'css', 'js', 'mincss', 'pug']); // task order is not random

/*
* Configuración de la tarea 'js' --> gulp-concat + gulp-uglify (gulp js)
*/
gulp.task('js', function () {
  gulp.src('js/*.js')
  .pipe(concat('scripts-min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./public/js'))
});

/*
* Configuración de la tarea 'less' --> gulp-less (gulp less)
*/
gulp.task('less', function () {
    return gulp.src('./less/**/[^_]*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest('./css/sources'));
});

/*
* Configuración de la tarea 'css' --> gulp-clean-css (gulp css)
*/
gulp.task('css', function() {
  return gulp.src('./css/sources/styles.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./css/dist'));
});

// Tarea 2 llamada minify-css
/*
* Configuración de la tarea 'minify-css' --> mincss (gulp mincss)
*/
gulp.task('mincss', function () {
    gulp.src('./css/dist/*.css')
        .pipe(concat('main.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('./public/css'))
});

/*
* Configuración de la tarea 'img' --> gulp-imagemin (gulp img)
*/
gulp.task('img', function () {
    return gulp.src(['img/**/*.*'])
        .pipe(imagemin())
        .pipe(gulp.dest('./public/img'));
});

/*
* Configuración de la tarea 'pug' --> gulp-pug (gulp pug)
*/
gulp.task('pug', function() {
  return gulp.src('./templates/*.pug')
      .pipe(data(function(file) {
        return JSON.parse(fs.readFileSync('./locales/lang_es.json'))
      }))
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest('./public'));
});

/*
* Configuración de la tarea 'sitemap' --> gulp-sitemap (gulp sitemap)
*/
gulp.task('sitemap', function () {
    gulp.src('public/**/*.html', {
            read: false
        })
        .pipe(sitemap({
            siteUrl: 'https://jalofernandez.github.io/infography',
            changefreq: 'weekly',
            priority: '1.0'
        }))
        .pipe(gulp.dest('./public'));
});
