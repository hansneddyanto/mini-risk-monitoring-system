const { calculateMarginStatus } = require("../src/utils/marginUtils");

describe("calculateMarginStatus", () => {
  test("should not trigger margin call when net equity is sufficient", () => {
    const res = calculateMarginStatus(100000, 20000, 0.25);
    expect(res.marginRequirement).toBe(25000);
    expect(res.marginShortfall).toBe(-55000);
    expect(res.marginCall).toBe(false);
  });

  test("should trigger margin call when net equity is insufficient", () => {
    const res = calculateMarginStatus(100000, 80000, 0.25);
    expect(res.marginRequirement).toBe(25000);
    expect(res.marginShortfall).toBe(5000);
    expect(res.marginCall).toBe(true);
  });

  test("should not trigger margin call when net equity exactly equals requirement", () => {
    const res = calculateMarginStatus(100000, 75000, 0.25);
    expect(res.marginRequirement).toBe(25000);
    expect(res.marginShortfall).toBe(0);
    expect(res.marginCall).toBe(false);
  });

  test("zero portfolio and loan amount", () => {
    const res = calculateMarginStatus(0, 0, 0.25);
    expect(res.marginRequirement).toBe(0);
    expect(res.marginShortfall).toBe(0);
    expect(res.marginCall).toBe(false);
  });
});
