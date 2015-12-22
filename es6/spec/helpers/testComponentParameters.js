import inflect from "jargon";

export default function testComponentParameters(ComponentClass, componentParameterNames) {
	componentParameterNames.forEach((parameterName) => {
		const parameterNamePascalCase = inflect(parameterName).pascal.toString();

		describe(`.${parameterName}(new${parameterNamePascalCase})`, () => {
			it(`should save new${parameterNamePascalCase}`, () => {
				let component = new ComponentClass();
				const testValue = "abc123";
				component = component[parameterName](testValue);
				component[parameterName]().should.eql(testValue);
			});
		});
	});
}
