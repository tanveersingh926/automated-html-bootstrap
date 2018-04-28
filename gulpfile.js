var gulp = require('gulp');
var sass = require('gulp-sass')
var useref = require('gulp-useref');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');



// move files to vendor folder
gulp.task('vendor', function(){
    // Move CSS bootstrap
    gulp.src([
        './node_modules/bootstrap/dist/css/bootstrap.min.css'
    ])
    .pipe(gulp.dest('src/css/vendor'))
    // Move JS bootstrap
    gulp.src([
        './node_modules/bootstrap/dist/js/bootstrap.min.js'
    ])
    .pipe(gulp.dest('src/js/vendor'))

    // jQuery
    gulp.src([
        './node_modules/jquery/dist/jquery.min.js'
    ])
    .pipe(gulp.dest('src/js/vendor'))

    // Popper.js
    gulp.src([
        './node_modules/popper.js/dist/umd/popper.min.js'
    ])
    .pipe(gulp.dest('src/js/vendor'))

    // Font Awesome
    gulp.src([
        'node_modules/font-awesome/**/*',
        '!./node_modules/font-awesome/{less,less/*}',
        '!./node_modules/font-awesome/{scss,scss/*}',
        '!./node_modules/font-awesome/.*',
        '!./node_modules/font-awesome/*.{txt,json,md}'
    ])
    .pipe(gulp.dest('dist/fonts'))
});


// Clean Dist Folder
gulp.task('clean:dist', function() {
    return del.sync('dist');
})


// compile sass files
gulp.task('sass', function() {
    return gulp.src('src/css/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});


// run browser with live-reloading
gulp.task('browserSync', function() {
    browserSync.init({
      server: {
        baseDir: 'src/'
      },
    })
})


// move vendor files without minification
gulp.task('useref-vendor', function(){
    return gulp.src('src/*.html')
      .pipe(useref())
      .pipe(gulp.dest('dist'))
});


// minify css and js files
gulp.task('useref', function(){
    return gulp.src('src/*.html')
      .pipe(useref())
      // minify only js files
      .pipe(gulpIf('*.js', uglify()))
      // minify only CSS files
      .pipe(gulpIf('*.css', cssnano()))
      .pipe(gulp.dest('dist'))
});


gulp.task('images', function(){
    return gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
        interlaced: true
      })))
    .pipe(gulp.dest('dist/img'))
});


gulp.task('watch', ['browserSync'], function (){
    // watchers
    gulp.watch('src/css/scss/*.scss', ['sass']); 
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('src/*.html', browserSync.reload); 
    gulp.watch('src/js/**/*.js', browserSync.reload); 
})


/* gulp.task('default', function (callback) {
    runSequence(['clean:dist', 'sass','useref-vendor', 'images', 'vendor', 'browserSync', 'watch'],
      callback
    )
}) */

gulp.task('build', function (callback) {
    runSequence('clean:dist', 'sass', 'useref-vendor', 'images', 'vendor' ,
      callback
    )
})

gulp.task('dev', function (callback) {
    runSequence('sass', 'vendor' , 'watch',
      callback
    )
})