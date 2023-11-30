import gulp from 'gulp';
import babel from 'gulp-babel';
import prettier from 'gulp-prettier';
import gulpIf from 'gulp-if';
import { exec } from 'child_process';

let testPassed = false;

async function test() {
  return new Promise((resolve, reject) => {
    exec('npm run test:unit && npm run test:e2e', (error, stdout, stderr) => {
      if (error) {
        console.error('FAILED TESTS:', stderr);
        reject(error);
      } else {
        testPassed = true;
        resolve();
      }
    });
  });
}

gulp.task('default', gulp.series(test, (done) => {
  gulp.src('src/**/*.js')
    .pipe(prettier())
    .pipe(babel())
    .pipe(gulpIf(testPassed, gulp.dest('dist')));
  done();
}));