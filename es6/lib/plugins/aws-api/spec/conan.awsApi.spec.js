import ConanAwsApi from "../conan.api.js";
import Conan from "../../../conan.js";
import AwsApiBuilder from "../awsApiBuilder.js";

describe("ConanAwsApi.constructor(conan)", () => {
	let conan;

	before(() => {
		conan = new Conan();
		conan.use(ConanAwsApi);
	});

	it("should be correctly plugged into conan", () => {
		conan.plugins[0].should.be.instanceOf(ConanAwsApi);
	});

	describe("(plugged methods)", () => {
		describe(".api", () => {
			it("should have an api member", () => {
				conan.should.have.property("api");
			});

			it("should be a function", () => {
				(typeof conan.api).should.equal("function");
			});

			describe("(after calling it)", () => {
				let awsApiBuilder;

				before(() => {
					awsApiBuilder = conan.api("testApi");
				});

				it("should call the setup function", () => {
					awsApiBuilder.should.be.instanceOf(AwsApiBuilder);
				});

				it("should add all the necessary steps", () => {
					const names = conan.steps.all.map(step => {
						return step.name;
					});
					names.should.eql(["conanFindApiStep"]);
				});
			});

			describe("(after calling deploy)", () => {
				it("should call the aws find api function");
			});
		});
	});
});
