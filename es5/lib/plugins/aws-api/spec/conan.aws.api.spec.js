"use strict";

// import ConanAwsApi from "../conan.api.js";
// import Conan from "../../../conan.js";
// import AwsApiBuilder from "../awsApiBuilder.js";
//
// describe("ConanAwsApi(conan, name)", () => {
// 	let api,
// 			conan,
// 			name;
//
// 	before(() => {
// 		name = "tester-api";
// 		conan = new Conan();
// 		conan.use(ConanAwsApi);
//
// 		api = conan.api(name);
// 	});
//
// 	describe(".constructor(conan, name)", () => {
// 		it("should add the find api step", () => {
// 			conan.steps.all.map(step => {
// 				return step.name === "conanFindApiStep";
// 			}).should.be.ok;
// 		});
// 	});
//
// 	describe(".description(text)", () => {
// 		it("should set the description text for the api");
// 	});
//
// 	describe(".stage(name)", () => {
// 		it("should return an instance of ConanAwsApiStage");
// 	});
// });