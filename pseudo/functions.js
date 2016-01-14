




function namedSomething() {

}

console.log("1:", namedSomething.name); // namedSomething;

var blah = 1;

var namedSomethingElse = function () {

}

console.log("2:", namedSomethingElse.name); // undefined;

() => {

}.bind(someOtherContext);



fs.readFile(path, namedSomething);
fs.readFile(path, namedSomethingElse);
fs.readFile(path, function () {});
fs.readFile(path, );
