export default function use(PluginClass) {
	this.plugins.push(new PluginClass(this));
}
