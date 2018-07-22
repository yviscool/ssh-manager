const gulp = require('gulp')
const mocha = require('gulp-mocha')
const eslint = require('gulp-eslint')

gulp.task('lint', () => {
    return gulp.src(['**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
})

gulp.task('unit-test', () => {
    return gulp.src(['test/**/*Test.js'], { read: false })
        .pipe(mocha({
            reporter: 'spec'
        }))
})

gulp.task('default', ['unit-test', 'lint'])
