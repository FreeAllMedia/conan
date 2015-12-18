import Conan from "../lib/conan.js";

describe("Conan(config)", () => {
  describe("(Instantiating with a config object)", () => {
    it("should not throw an error", () => {
      () => {
        const config = {};
        const conan = new Conan(config);
      }.should.not.throw();
    });

    it("should save config object to conan.config", () => {
      const config = {};
      const conan = new Conan(config);
      conan.config.should.eql(config);
    });
  });

  describe("(Instantiating without a config object)", () => {
    it("should not throw an error", () => {
      () => {
        const conan = new Conan();
      }.should.not.throw();
    });

    it("should save an empty object to conan.config", () => {
      const conan = new Conan();
      conan.config.should.eql({});
    });
  });
});
