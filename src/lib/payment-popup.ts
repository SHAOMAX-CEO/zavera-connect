export const PAYMENT_POPUP_INTERVAL_MS = 3000;

export function paymentPopupFrame(step: number, paymentCount: number) {
  return {
    visible: paymentCount > 0 && step % 2 === 0,
    index: paymentCount > 0 ? Math.floor(step / 2) % paymentCount : 0,
  };
}