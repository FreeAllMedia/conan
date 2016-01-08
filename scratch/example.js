This will fail:

``` javascript

import unzip from "unzip2";

const zip = archiver('zip', {});
zip.append(fs.createReadStream("./some/file.js"), {name: "file.js"});
zip.finalize();
zip
	.pipe(unzip.Parse());

```

This will succeed:

``` javascript
import unzip from "unzip2";
import fs from "fs";

let zip = archiver('zip', {});
zip.append(fs.createReadStream("./some/file.js"), {name: "file.js"});
zip.pipe(fs.createWriteStream("./tmp/temp.zip"));
zip.finalize();

let zip = fs.createReadStream("./tmp/temp.zip");
zip
	.pipe(unzip.Parse());
```
