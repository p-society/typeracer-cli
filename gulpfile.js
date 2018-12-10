const gulp = require("gulp");
const ts = require("gulp-typescript");
const souremaps = require("gulp-sourcemaps");
const tsProject = ts.createProject("tsconfig.json", {
  typescript : require("typescript")
})

gulp.task("build", function() {
  gulp.src("process.yml")
    .pipe(gulp.dest("dist"));
  
  return tsProject.src()
    .pipe(souremaps.init())
    .pipe(tsProject())
    .js
    .pipe(souremaps.write())
    .pipe(gulp.dest("dist"));
});

gulp.task("watchTask", function () {
  gulp.watch("src/**/*.ts", ["build"]);
});

gulp.task("default", gulp.series("build"));
gulp.task("watch", gulp.series("build", "watchTask"));

