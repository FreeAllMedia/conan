import gulp from "gulp";
import runSequence from "gulp-run-sequence";
import compareVersion from "compare-version";

gulp.task("test", cb => {
	let es6Environment = compareVersion(process.version, "4.0.0") >= 0;	

	if (es6Environment) {
		runSequence("test-es5", cb);
	} else {
		runSequence("test-es6", cb);
	}
});
