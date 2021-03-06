describe("Popup Events", () => {
  beforeEach(() => {
    browser.url("http://localhost:3099");
  });

  it("should be able to receive events from opener frames", () => {
    const expected = "hello from frame3!";

    $("#open-popup").click();
    browser.switchWindow("popup");
    browser.waitUntil(
      () => {
        return $("body").getHTML() != null;
      },
      {
        timeout: 1000,
        timeoutMsg: "expected body to exist",
      }
    );

    browser.switchWindow("localhost:3099");

    browser.switchToFrame(2);

    $("#popup-message").setValue(expected);
    $("#send").click();

    browser.switchWindow("popup");

    browser.waitUntil(
      () => {
        return $("p").getHTML !== "";
      },
      {
        timeout: 1000,
      }
    );
    const actual = $("p").getText();

    expect(actual).toBe(expected);
  });

  it("should be able to send events to opener frames", () => {
    const expected = "hello from popup!";

    $("#open-popup").click();

    browser.switchWindow("popup");
    browser.waitUntil(
      () => {
        return $("body").getHTML() != null;
      },
      {
        timeout: 1000,
        timeoutMsg: "expected body to exist",
      }
    );

    $("#from-popup-message").setValue(expected);
    $("#send").click();

    browser.switchWindow("localhost:3099");
    browser.switchToFrame(1);

    browser.waitUntil(
      () => {
        return $("p").getHTML !== "";
      },
      {
        timeout: 1000,
      }
    );
    const actual = $("p").getText();

    expect(actual).toContain(expected);
  });

  it("should not double-receive events in popups", () => {
    const expected = "hello from popup!";

    $("#open-popup").click();

    browser.switchWindow("popup");
    browser.waitUntil(
      () => {
        return $("body").getHTML() != null;
      },
      {
        timeout: 1000,
        timeoutMsg: "expected body to exist",
      }
    );

    $("#from-popup-message").setValue(expected);
    $("#send").click();

    browser.switchWindow("localhost:3099");
    browser.switchToFrame(1);

    browser.waitUntil(
      () => {
        return $("p").getHTML !== "";
      },
      {
        timeout: 1000,
      }
    );
    const actual = $("p").getText();

    expect(actual).not.toContain("FAILURE");
  });
});
