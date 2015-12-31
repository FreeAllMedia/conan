import save from "./save.js";

export default function handler(event, context) {
	save(event, () => {
		context.succeed("Saved!");
	});
}
