import gulp from "gulp";
import paths from "../paths.json";

gulp.task("test-watch", ["suppress-errors", "test-es6"], () => {
	gulp.watch([
		paths.source.lib,
		paths.source.spec,
		paths.source.specAssets,
		paths.source.libAssets
	], ["test-es6"]);
});
