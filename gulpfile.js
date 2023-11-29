import gulp from 'gulp';
import babel from 'gulp-babel';
import prettier from 'gulp-prettier';
import { exec } from 'child_process';

async function test() {
  return new Promise((resolve, reject) => {
    exec('npm run test:unit', (error, stdout, stderr) => {
      console.error(stderr);
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function build() {
  return gulp.src('src/**/*.js')
    .pipe(prettier())
    .pipe(babel())
    .pipe(gulp.dest('dist'));
}

gulp.task('default', gulp.series(test, build));
