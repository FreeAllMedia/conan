import gulp from "gulp";
import requireHack from "./babel6.require.hack.js";
requireHack();

gulp.task("build", ["build-spec"]);
