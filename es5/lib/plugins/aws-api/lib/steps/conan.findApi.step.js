"use strict";

// import AWS from "aws-sdk";
// // shotcut constructor to allow rewire
// const ApiGateWayConstructor = AWS.APIGateway;
//
// export default function conanFindApiStep(conan, confinishStep) {
// 	conan.stepInputData
// 	const apiGateway = new ApiGateWayConstructor({region: conanContext.config("region")});
// 	// need to find if the api is new
// 	apiGateway.getRestApis({},
// 		(error, response) => {
// 			if(response && response.items && Array.isArray(response.items)) {
// 				const found = response.items.find(restApi => {
// 					return restApi.name === conanContext.stepBuilder.name;
// 				});
// 				finishStep(error, found);
// 			} else {
// 				finishStep(error);
// 			}
// 		}
// 	);
// }