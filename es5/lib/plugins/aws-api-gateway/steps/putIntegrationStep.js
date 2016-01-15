import jargon from "jargon";

function getVelocityMap(parameterArray) {
	let result = [];
	if (parameterArray !== undefined) {
		parameterArray.forEach(
			headerName => {
				// TODO: add this requirements to jargon itself
				const curatedHeaderName = jargon(headerName).camel.toString().replace(/-|{|}/g, "");
				const curatedBrackets = headerName.replace(/\{|}/g, "");
				result.push(`\n\"${curatedHeaderName}\": \"$input.params('${curatedBrackets}')\"`);
			}
		);
	}
	return result.join(",");
}

export default function putIntegrationStep(conan, context, done) {
	const restApiId = context.results.restApiId;
	let resourceId = context.results.apiResourceId;
	const lambdaArn = context.results.lambdaArn;
	if(restApiId
			&& resourceId
			&& lambdaArn) {
		const api = new context.libraries.AWS.APIGateway({
			region: conan.config.region
		});
		const headerMapValues = getVelocityMap(context.parameters.headers());
		const headerMap = `\"header\": {${headerMapValues}\n}`;
		const queryStringMapValues = getVelocityMap(context.parameters.queryStrings());
		const queryStringMap = `\"queryString\": {${queryStringMapValues}\n}`;
		const pathTokens = context.parameters.path().split("/");
		const pathParameters = pathTokens.filter(
			pathToken => {
				return pathToken.match(/{[a-zA-Z0-9]*}/);
			}
		);
		const pathMapValues = getVelocityMap(pathParameters);
		const pathMap = `\"path\": {${pathMapValues}\n}`;
		const paramsSection = `\"params\": {\n ${headerMap},\n ${queryStringMap},\n ${pathMap}},`;
		const uri = `arn:aws:apigateway:${conan.config.region}:lambda:path/2015-03-31/functions/${lambdaArn}/invocations`;
		const requestTemplates = {"application/json": `{\n  ${paramsSection}\n \"data\": $input.json('$')\n}`};
		const apiParameters = {
			restApiId,
			resourceId,
			type: "AWS",
			uri,
			httpMethod: context.parameters.method(),
			integrationHttpMethod: "POST",
			requestTemplates
		};
		api.putIntegration(apiParameters,
			(error, response) => {
				if(response) {
					done(null, {});
				} else {
					done(error);
				}
			});
	} else {
		done(null, { });
	}
}
