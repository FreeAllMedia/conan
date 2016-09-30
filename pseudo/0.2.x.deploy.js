import Conan from "conan";

// Yes, you need to compare versions yourself.
const conan = new Conan().use(
	"conan-aws-lambda",
	"conan-aws-api-gateway"
);

conan.plugins["conan-aws-lambda"]; // instance
conan.plugins["conan-aws-api-gateway"]; // instance

conan
.lambda("HelloWorld")
	.description("A simple 'Hello, World!' example!")
	.filePath("helloWorld.js")
	.role("MyIamRoleName")
.deploy(error => {

});
