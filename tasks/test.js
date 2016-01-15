import gulp from "gulp";
import runSequence from "gulp-run-sequence";
import compareVersion from "compare-version";

gulp.task("test", cb => {
	const versionNumber = process.env.TRAVIS_NODE_VERSION || process.version;
	console.log("VERSION NUMBER:", versionNumber);

	if (compareVersion(versionNumber, "4.0.0") >= 0) {
		runSequence("test-es6", cb);
	} else {
		runSequence("test-es5", cb);
	}
});
