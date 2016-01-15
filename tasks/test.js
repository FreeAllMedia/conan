import gulp from "gulp";
import runSequence from "gulp-run-sequence";
import compareVersion from "compare-version";

gulp.task("test", cb => {
	if (compareVersion("4.0.0", process.env.TRAVIS_NODE_VERSION) >= 0) {
		if(!global._babelPolyfill) {
			require("babel-polyfill");
		}
		runSequence("test-es6", cb);
	} else {
		runSequence("test-es5", cb);
	}
});
