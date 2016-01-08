const yauzl = require("yauzl");

yauzl.open("./tmp/async-test.zip", (error, zipfile) => {
	if (error) { throw error; }
	zipfile.on("entry", (entry) => {
		console.log(entry.fileName);
	});
	zipfile.on("end", () => {
		console.log("END");
	});
});
