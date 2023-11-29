import gulp from 'gulp';
import babel from 'gulp-babel';
import prettier from 'gulp-prettier';

async function build() {
  return gulp.src('src/**/*.js')
    .pipe(prettier())
    .pipe(babel())
    .pipe(gulp.dest('dist'));
}

function watch() {
  gulp.watch('src/**/*.js', gulp.series(build));
}


gulp.task('default', gulp.series(build, watch));
