import save from "./save.js";

/* istanbul ignore next */
export function handler(event, context) {
	save(event, () => {
		context.succeed("Saved!");
	});
}
