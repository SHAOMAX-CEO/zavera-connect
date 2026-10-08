import { describe, expect, test } from "bun:test";
import { PAYMENT_POPUP_INTERVAL_MS, paymentPopupFrame } from "./payment-popup.ts";

describe("confirmed payment popup rotation", () => {
  test("appears for three seconds then disappears for three seconds", () => {
    expect(PAYMENT_POPUP_INTERVAL_MS).toBe(3000);
    expect(paymentPopupFrame(0, 2)).toEqual({ visible: true, index: 0 });
    expect(paymentPopupFrame(1, 2)).toEqual({ visible: false, index: 0 });
    expect(paymentPopupFrame(2, 2)).toEqual({ visible: true, index: 1 });
  });

  test("continues repeating even with only one confirmed payment", () => {
    for (let step = 0; step < 10; step++) {
      expect(paymentPopupFrame(step, 1)).toEqual({ visible: step % 2 === 0, index: 0 });
    }
  });

  test("never displays a payment claim without confirmed records", () => {
    expect(paymentPopupFrame(0, 0)).toEqual({ visible: false, index: 0 });
    expect(paymentPopupFrame(8, 0)).toEqual({ visible: false, index: 0 });
  });
});