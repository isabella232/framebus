import bus = require("../../src/lib/framebus");

describe("publish", function () {
  beforeEach(function () {
    bus._attach();
  });

  it("should be directly usable", function () {
    const publish = bus.publish;

    expect(function () {
      publish("event", { data: "data" });
    }).not.toThrowError();
  });

  it("should return false if event is not a string", function () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const actual = bus.publish({} as any, { data: "data" });

    expect(actual).toBe(false);
  });

  it("should return false if origin is not a string", function () {
    const actual = bus
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .target({ origin: "object" } as any)
      .publish("event", { data: "data" });

    expect(actual).toBe(false);
  });

  it("should return true if origin and event are strings", function () {
    const actual = bus
      .target("https://example.com")
      .publish("event", { data: "data" });

    expect(actual).toBe(true);
  });

  it("can pass a reply function without passing data", function () {
    const actual = bus
      .target("https://example.com")
      .publish("event", jest.fn());

    expect(actual).toBe(true);
  });
});
