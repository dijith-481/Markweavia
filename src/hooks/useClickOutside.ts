import { useEffect, RefObject } from "react";

export function useClickOutside(
  ref: RefObject<HTMLElement> | RefObject<HTMLElement>[],
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled: boolean = true,
) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const listener = (event: MouseEvent | TouchEvent) => {
      const refsArray = Array.isArray(ref) ? ref : [ref];
      let containedInRef = false;
      for (const r of refsArray) {
        if (r.current && r.current.contains(event.target as Node)) {
          containedInRef = true;
          break;
        }
      }
      if (!containedInRef) {
        handler(event);
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
}
