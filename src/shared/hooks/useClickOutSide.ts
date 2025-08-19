import { useEffect, RefObject } from "react";

type Callback = () => void;

/**
 * Custom hook to detect clicks outside of a referenced element
 *
 * @param ref - React ref object pointing to the element
 * @param handler - Callback to execute when a click occurs outside the ref element
 * @param active - Whether the outside click listener is active
 */
const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T>,
  handler: Callback,
  active: boolean = true,
): void => {
  useEffect(() => {
    if (!active) return;

    const listener = (event: MouseEvent | TouchEvent): void => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, active]);
};

export default useClickOutside;