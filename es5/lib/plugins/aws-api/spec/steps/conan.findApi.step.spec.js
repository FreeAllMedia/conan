"use strict";

// import rewire from "rewire";
// import sinon from "sinon";
// const conanFindApiStep = rewire("../../steps/conan.findApi.step.js");
//
// describe("conanFindApiStep", () => {
// 	let awsSpy,
// 		conanContext,
// 		awsApiGatewayConstructorSpy;
//
// 	before(() => {
// 		conanContext = {
// 			config: () => {
// 				return "us-east-1";
// 			}
// 		};
// 		awsSpy = sinon.spy((params, callback) => {
// 			callback();
// 		});
// 		awsApiGatewayConstructorSpy = sinon.spy();
//
// 		conanFindApiStep.__set__("ApiGateWayConstructor",
// 			(params) => {
// 				awsApiGatewayConstructorSpy(params);
// 				return {
// 					getRestApis: awsSpy
// 				};
// 			}
// 		);
// 	});
//
// 	it("should be a function", () => {
// 		(typeof conanFindApiStep).should.equal("function");
// 	});
//
// 	it("should call the aws sdk get-api function", done => {
// 		conanFindApiStep(conanContext, () => {
// 			awsSpy.called.should.be.true;
// 			done();
// 		});
// 	});
//
// 	it("should call the constructor with the appropiate region", done => {
// 		conanFindApiStep(conanContext, () => {
// 			awsApiGatewayConstructorSpy.calledWith({region: "us-east-1"}).should.be.true;
// 			done();
// 		});
// 	});
//
// 	describe("(scenarios)", () => {
// 		let keyAwsApiName;
// 		let keyAwsApiId;
// 		let keyAwsApiObject;
// 		let awsGetRestApisResponse;
//
// 		before(() => {
// 			keyAwsApiName = "testName";
// 			keyAwsApiId = "xgslsi7";
// 			keyAwsApiObject = {name: keyAwsApiName, id: keyAwsApiId};
// 			awsGetRestApisResponse = {items: [keyAwsApiObject, {name: "other", id: "ss"}]};
//
// 			awsSpy = sinon.spy((params, callback) => {
// 				callback(null, awsGetRestApisResponse);
// 			});
//
// 			conanFindApiStep.__set__("ApiGateWayConstructor",
// 				() => {
// 					return {
// 						getRestApis: awsSpy
// 					};
// 				}
// 			);
// 		});
//
// 		describe("(when the api exists)", () => {
// 			it("should return the existing api", done => {
// 				conanContext.stepBuilder = {name: keyAwsApiName};
// 				conanFindApiStep(conanContext,
// 					(error, result) => {
// 						result.should.eql(keyAwsApiObject);
// 						done();
// 					}
// 				);
// 			});
// 		});
//
// 		describe("(when the api do not exists)", () => {
// 			it("should return null/undefined", done => {
// 				conanContext.stepBuilder = {name: "unexistingName"};
// 				conanFindApiStep(conanContext,
// 					(error, result) => {
// 						(!result).should.be.true;
// 						done();
// 					}
// 				);
// 			});
// 		});
// 	});
// });