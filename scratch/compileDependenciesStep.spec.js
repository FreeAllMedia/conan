// import compileDependenciesStep from "../../steps/compileDependenciesStep.js";
//
//
// // TODO: for this step, instead of using a shell cli command to call thaumaturgy
// // it's better to just invoke the lambda using the aws sdk
// // this compile step is: invoke + uncompress + copying around
// // or it can be three different steps which will result in more specs and
// // a more complex step shared communication in exchange of reusable steps
// // so it's maybe an early optimization at this point
//
// // TIP: almost exact aws sdk invoke example in the very same thaumaturgy source code:
// // https://github.com/nicosommi/thaumaturgy/blob/master/cli/thaumaturgy-build#L92
//
// describe("compileDependenciesStep", () => {
// 	let conan,
// 		context,
// 		constructorSpy,
// 		invokeSpy;
//
// 	class Lambda {
// 		constructor(params) {
// 			constructorSpy(params);
// 		}
//
// 		invoke(params, callback) {
// 			invokeSpy(params, callback);
// 		}
// 	}
//
// 	beforeEach(() => {
// 		context = {
// 			parameters: {
// 				name: "test Lambda"
// 			},
// 			dependencies: {
// 				aws: {
// 					Lambda
// 				}
// 			}
// 		};
//
// 		conan = { config:
// 			{ "region": "us-east-1" }
// 		};
// 	});
//
// 	it("should be a function", () => {
// 		(typeof compileDependenciesStep).should.equal("function");
// 	});
//
// 	describe("(calling thaumaturgy lambda)", () => {
// 		beforeEach(done => {
// 			compileDependenciesStep(conan, context, () => {
// 				done();
// 			});
// 		});
//
// 		it("should invoke the thaumaturgy lambda function");
//
// 		describe("(parameters)", () => {
// 			it("should send the correct parameters to the Lambda constructor");
// 			it("should send the correct parameters to the Lambda invoke");
// 		});
//
// 		describe("(response)", () => {
// 			it("should set the result path folder in the result");
// 			it("should create the specified path");
// 			it("should use a tmp directory");
// 			it("should uncompress the zip file");
// 		});
//
// 		describe("(error)", () => {
// 			it("should return the error");
// 		});
// 	});
// });
