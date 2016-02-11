/* eslint-disable no-unused-vars */
import Conan, {
	ConanComponent,
	ConanAwsLambdaPlugin,
	ConanAwsApiGatewayPlugin
} from "../lib/conan.js";

import ExpectedConanComponent from "../lib/components/conanComponent.js";
import ExpectedConanAwsLambdaPlugin from "../lib/plugins/aws-lambda/conanAwsLambdaPlugin.js";
import ExpectedConanAwsApiGatewayPlugin from "../lib/plugins/aws-api-gateway/conanAwsApiGatewayPlugin.js";

import sinon from "sinon";

describe("Conan(config)", () => {
	let conan;

	beforeEach(() => {
		conan = new Conan();
	});

	it("should pass itself to ConanSteps", () => {
		conan.steps.parent.should.eql(conan);
	});

	describe("(Instantiating with a config object)", () => {
		it("should not throw an error", () => {
			(() => {
				const config = {key: "value"};
				conan = new Conan(config);
			}).should.not.throw();
		});

		it("should save config object to conan.config", () => {
			const config = {key: "value"};
			conan = new Conan(config);
			conan.config.should.eql(config);
		});
	});

	describe("(Instantiating without a config object)", () => {
		it("should save an empty object to conan.config", () => {
			conan.config.should.eql({});
		});
	});

	describe("(Exports)", () => {
		it("should export ConanComponent", () => {
			ConanComponent.should.eql(ExpectedConanComponent);
		});

		it("should export ConanAwsLambdaPlugin", () => {
			ConanAwsLambdaPlugin.should.eql(ExpectedConanAwsLambdaPlugin);
		});

		it("should export ConanAwsApiGatewayPlugin", () => {
			ConanAwsApiGatewayPlugin.should.eql(ExpectedConanAwsApiGatewayPlugin);
		});
	});
});
