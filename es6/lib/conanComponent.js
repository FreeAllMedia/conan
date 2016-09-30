import ChainLink from "mrt";

export default class ConanComponent extends ChainLink {
	component(name, Constructor) {
		return this.link(name, Constructor).apply(this);
	}
}
