const { readFileSync, writeFileSync } = require("fs");

const version = process.argv[2];

// read files
let package_ = JSON.parse(readFileSync("package.json", "utf8"));

// update versions
package_.version = version;

writeFileSync("package.json", JSON.stringify(package_, null, "\t"));
