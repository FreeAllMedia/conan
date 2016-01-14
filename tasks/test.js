import gulp from "gulp";
import runSequence from "gulp-run-sequence";
import compareVersion from "compare-version";

gulp.task("test", cb => {
	let es6Environment = compareVersion("4.0.0", process.version) >= 0;	

	if (es6Environment) {
		runSequence("test-es5", cb);
	} else {
		runSequence("test-es6", cb);
	}
});
