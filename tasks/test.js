import gulp from "gulp";
import runSequence from "gulp-run-sequence";

gulp.task("test", cb => {
	let es6Environment = true;

	if (process.env.TRAVIS_NODE_VERSION) {
		console.log("TRAVIS_NODE_VERSION", process.env.TRAVIS_NODE_VERSION);
		es6Environment = ["4.0", "4.1"].indexOf(process.env.TRAVIS_NODE_VERSION) !== -1;
	}

	if (es6Environment) {
		runSequence("test-es5", cb);
	} else {
		runSequence("test-es6", cb);
	}
});
