// Tiny localStorage-backed stores that React components subscribe to with
// useSyncExternalStore (no setState-in-effect, no hydration mismatch: the
// server snapshot is the empty value and the client re-renders after mount).
import { useMemo, useSyncExternalStore } from "react";

export function createLocalStore({ key, event, empty, parse = JSON.parse, serialize = JSON.stringify, validate }) {
  const emptyRaw = serialize(empty);

  const getRaw = () => {
    try {
      return window.localStorage.getItem(key) ?? emptyRaw;
    } catch {
      return emptyRaw;
    }
  };

  const read = () => {
    try {
      const value = parse(getRaw());
      return validate && !validate(value) ? empty : value;
    } catch {
      return empty;
    }
  };

  const write = (value) => {
    try {
      window.localStorage.setItem(key, serialize(value));
    } catch {
      // storage full or blocked — keep the UI responsive anyway
    }
    window.dispatchEvent(new Event(event));
  };

  const subscribe = (callback) => {
    const onStorage = (e) => {
      if (e.key === null || e.key === key) callback();
    };
    window.addEventListener(event, callback);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(event, callback);
      window.removeEventListener("storage", onStorage);
    };
  };

  function useValue() {
    const raw = useSyncExternalStore(subscribe, getRaw, () => emptyRaw);
    return useMemo(() => {
      try {
        const value = parse(raw);
        return validate && !validate(value) ? empty : value;
      } catch {
        return empty;
      }
    }, [raw]);
  }

  // true only after hydration on the client (lets UIs avoid empty-state flashes)
  function useHydrated() {
    return useSyncExternalStore(subscribe, () => true, () => false);
  }

  return { key, event, read, write, subscribe, useValue, useHydrated };
}
