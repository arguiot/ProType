const gulp = require("gulp")
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
const babili = require("gulp-babili");
const rigger = require("gulp-rigger");
const injectVersion = require("gulp-inject-version")
gulp.task("modern-full", () => {
    gulp.src("src/base.js")
        .pipe(rigger())
        .pipe(injectVersion())
        .pipe(rename({
            basename: "protype"
        }))
        .pipe(gulp.dest("dist"));
});
gulp.task("minify-full", () => {
    gulp.src("src/base.js")
        .pipe(rigger())
        .pipe(injectVersion())
        .pipe(babel({
            presets: ["env"]
        }))
        .pipe(uglify())
        .pipe(rename({
            basename: "protype",
            suffix: ".min"
        }))
        .pipe(gulp.dest("dist"));
});
gulp.task("tests", () => {
    gulp.src("src/base.js")
        .pipe(rigger())
        .pipe(injectVersion())
        .pipe(rename({
            basename: "protype"
        }))
        .pipe(gulp.dest("__test__"));
});
gulp.task("default", ["modern-full", "minify-full", "tests"]);
