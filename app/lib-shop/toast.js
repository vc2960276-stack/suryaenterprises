// Fire-and-forget toast notifications rendered by <Toaster /> in the layout.
export const TOAST_EVENT = "surya-toast";

export function toast(message, { tone = "default", action } = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message, tone, action, id: `${Date.now()}-${Math.random()}` } }));
}
