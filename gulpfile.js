const gulp = require("gulp")
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
const babili = require("gulp-babili");
const rigger = require("gulp-rigger");
const injectVersion = require("gulp-inject-version")
const modern = () => {
	return gulp.src("src/base.js")
		.pipe(rigger())
		.pipe(injectVersion())
		.pipe(rename({
			basename: "protype",
			suffix: ".es7"
		}))
		.pipe(gulp.dest("dist"));
}
const minify = () => {
	return gulp.src("src/base.js")
		.pipe(rigger())
		.pipe(injectVersion())
		.pipe(babili({
			mangle: {
				keepClassName: true
			}
		}))
		.pipe(rename({
			basename: "protype",
			suffix: ".es7.min"
		}))
		.pipe(gulp.dest("dist"));
}
const old = () => {
	return gulp.src("src/base.js")
		.pipe(rigger())
		.pipe(injectVersion())
		.pipe(babel({
			presets: ["env"]
		}))
		.pipe(rename({
			basename: "protype"
		}))
		.pipe(gulp.dest("dist"));
}
const minifyOld = () => {
	return gulp.src("src/base.js")
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
}
const tests = () => {
	return gulp.src("src/base.js")
		.pipe(rigger())
		.pipe(injectVersion())
		.pipe(rename({
			basename: "protype"
		}))
		.pipe(gulp.dest("__test__"));
}

exports.modern = modern
exports.minify = minify
exports.old = old
exports.minifyOld = minifyOld
exports.tests = tests
exports.default = gulp.parallel(modern, minify, old, minifyOld, tests)
