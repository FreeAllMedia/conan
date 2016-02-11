import Conan from "../../../conan.js";
import ConanAwsApiGateway from "../components/conanAwsApiGateway.js";
import ConanAwsApiGatewayPlugin from "../conanAwsApiGatewayPlugin.js";
import sinon from "sinon";
import AWS from "aws-sdk";

describe("ConanAwsApiGatewayPlugin(conan)", () => {
	let conan,
			api;

	beforeEach(() => {
		conan = new Conan();
		conan.use(ConanAwsApiGatewayPlugin);
	});

  it("should setup conan.api()", () => {
		(typeof conan.api).should.eql("function");
	});

	it("should setup an empty object to hold apis at conan.apis", () => {
		conan.apis.should.eql({});
	});

	describe("(AWS)", () => {
		let librarySpy;
		let fakeConan;

		before(done => {
			librarySpy = sinon.spy();

			fakeConan = {
				steps: {
					library: (name, value) => {
						librarySpy(name, value);
						done();
					}
				}
			};

			/* eslint-disable no-new */
			new ConanAwsApiGatewayPlugin(fakeConan);
		});

		it("should add the AWS library", () => {
			librarySpy.calledWith("AWS", AWS).should.be.true;
		});
	});

	describe("conan.api(name)", () => {
		let name;

		beforeEach(() => {
			name = "MyAPI";

			api = conan.api(name);
		});

		it("should return an instance of ConanAwsApiGateway", () => {
			api.should.be.instanceOf(ConanAwsApiGateway);
		});

		it("should pass conan to the ConanAwsApiGateway constructor", () => {
			api.conan.should.eql(conan);
		});

		it("should pass the api name to the ConanAwsApiGateway constructor", () => {
			api.name().should.eql(name);
		});
	});
});
