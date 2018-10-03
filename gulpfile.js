const gulp = require('gulp')
const mocha = require('gulp-mocha')
const eslint = require('gulp-eslint')

const lint = () => {
    return gulp.src(['**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
}

const test = () => {
    return gulp.src(['test/**/*Test.js'], { read: false })
        .pipe(mocha({
            reporter: 'spec'
        }))
}

gulp.task('default', gulp.parallel(lint, test))
gulp.task('lint', lint)
gulp.task('test', test)